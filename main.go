package main

import (
	_ "embed"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"sync"

	"golang.org/x/exp/maps"
	"golang.org/x/sync/errgroup"
)

var (
	listenAddr = flag.String("listen_addr", "[::]:9999", "address to listen on")
)

func main() {
	lis, err := net.Listen("tcp", *listenAddr)
	if err != nil {
		log.Fatalf("failed to listen: %s", err)
	}
	log.Printf("listening on %s", lis.Addr())

	type client struct {
		msgChan   chan []byte
		closeChan chan struct{}
	}

	var clientsMu sync.Mutex
	clients := map[*http.Request]*client{}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("web")))
	mux.Handle("/_data", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			rw.Header().Add("Cache-Control", "no-store")
			rw.Header().Add("Content-Type", "text/event-stream")
			flusher, ok := rw.(http.Flusher)
			if !ok {
				http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
				return
			}

			c := &client{msgChan: make(chan []byte), closeChan: make(chan struct{})}

			clientsMu.Lock()
			clients[r] = c
			clientsMu.Unlock()

			for {
				select {
				case <-r.Context().Done():
					goto done
				case msg := <-c.msgChan:
					fmt.Fprintf(rw, "event: message\n")
					fmt.Fprintf(rw, "data: %s\n\n", string(msg))
					flusher.Flush()
				}
			}

		done:
			close(c.closeChan)

			clientsMu.Lock()
			delete(clients, r)
			clientsMu.Unlock()
		case http.MethodPost:
			body, err := io.ReadAll(r.Body)
			if err != nil {
				return
			}

			g, ctx := errgroup.WithContext(r.Context())
			clientsMu.Lock()
			cs := maps.Values(clients)
			clientsMu.Unlock()

			for _, c := range cs {
				c := c
				g.Go(func() error {
					select {
					case <-ctx.Done():
						return ctx.Err()
					case <-c.closeChan:
						break
					case c.msgChan <- body:
						break
					}
					return nil
				})
			}

			if err := g.Wait(); err != nil {
				log.Printf("error: %s", err)
				return
			}
		default:
			rw.WriteHeader(http.StatusBadRequest)
			return
		}
	}))

	if err := http.Serve(lis, mux); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
