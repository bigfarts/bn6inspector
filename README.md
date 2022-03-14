# bn6inspector

Inspect battle information from BN6.

## How to use

### VBA-RR

1. Build the bn6inspector Go binary and run it.

1. Run `lua/bn6debug_vbarr.lua`.

1. Go to http://localhost:9999 and you should see live updates.

### BizHawk

1. Build the bn6inspector Go binary and run it.

1. In `lua/bn6debug_bizhawk.lua`, set `USE_INSPECTOR` to `true`.

1. Run `lua/bn6debug_bizhawk.lua`.

1. Go to http://localhost:9999 and you should see live updates.
