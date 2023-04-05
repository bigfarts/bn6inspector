const source = new EventSource("/_data");
source.onmessage = (e) => {
    let main = document.getElementById("main");
    const info = JSON.parse(e.data);
    while (main.firstChild != null) {
        main.firstChild.innerText = "";
        main.removeChild(main.firstChild);
    }
    main.appendChild(formatInfo(info));
};

function unpackcollflags(flags) {
    return {
        shielding: (flags & 0x00000001) != 0,
        invis: (flags & 0x00000002) != 0,
        unk03: (flags & 0x00000004) != 0,
        invincible: (flags & 0x00000008) != 0,
        airshoes: (flags & 0x00000010) != 0,
        floatshoes: (flags & 0x00000020) != 0,
        cannotslide: (flags & 0x00000040) != 0,
        unk08: (flags & 0x00000080) != 0,
        dead: (flags & 0x00000100) != 0,
        flashing: (flags & 0x00000200) != 0,
        flinching: (flags & 0x00000400) != 0,
        paralyzed: (flags & 0x00000800) != 0,
        sliding: (flags & 0x00001000) != 0,
        blinded: (flags & 0x00002000) != 0,
        immobilized: (flags & 0x00004000) != 0,
        confused: (flags & 0x00008000) != 0,
        frozen: (flags & 0x00010000) != 0,
        superarmor: (flags & 0x00020000) != 0,
        undershirt: (flags & 0x00040000) != 0,
        movedone: (flags & 0x00080000) != 0,
        dragged: (flags & 0x00100000) != 0,
        angry: (flags & 0x00200000) != 0,
        usingaction: (flags & 0x00400000) != 0,
        unk24: (flags & 0x00800000) != 0,
        unk25: (flags & 0x01000000) != 0,
        respectsice: (flags & 0x02000000) != 0,
        ignorespoison: (flags & 0x04000000) != 0,
        beastover: (flags & 0x08000000) != 0,
        unk29: (flags & 0x10000000) != 0,
        unk30: (flags & 0x20000000) != 0,
        unk31: (flags & 0x40000000) != 0,
        bubbled: (flags & 0x80000000) != 0,
    };
}

function unpackcollflags2(flags) {
    return {
        die: (flags & 0x00000001) != 0,
        flash: (flags & 0x00000002) != 0,
        flinch: (flags & 0x00000004) != 0,
        paralyze: (flags & 0x00000008) != 0,
        slide: (flags & 0x00000010) != 0,
        blind: (flags & 0x00000020) != 0,
        immobilize: (flags & 0x00000040) != 0,
        confuse: (flags & 0x00000080) != 0,
        drag: (flags & 0x00000100) != 0,
        anger: (flags & 0x00000200) != 0,
        unk11: (flags & 0x00000400) != 0,
        unk12: (flags & 0x00000800) != 0,
        unk13: (flags & 0x00001000) != 0,
        unk14: (flags & 0x00002000) != 0,
        unk15: (flags & 0x00004000) != 0,
        unk16: (flags & 0x00008000) != 0,
        freeze: (flags & 0x00010000) != 0,
        bubble: (flags & 0x00020000) != 0,
        unk19: (flags & 0x00040000) != 0,
        unk20: (flags & 0x00080000) != 0,
        unk21: (flags & 0x00100000) != 0,
        unk22: (flags & 0x00200000) != 0,
        unk23: (flags & 0x00400000) != 0,
        unk24: (flags & 0x00800000) != 0,
        unk25: (flags & 0x01000000) != 0,
        unk26: (flags & 0x02000000) != 0,
        unk27: (flags & 0x04000000) != 0,
        unk28: (flags & 0x08000000) != 0,
        unk29: (flags & 0x10000000) != 0,
        unk30: (flags & 0x20000000) != 0,
        unk31: (flags & 0x40000000) != 0,
        unk32: (flags & 0x80000000) != 0,
    };
}

function formatQ16_16(num) {
    let sign;
    if (num >= 0x80000000) {
        num = ~num + 1;
        sign = "-";
    } else {
        sign = "";
    }

    let numWhole = num >> 16;
    let numFrac = (num & 0xffff) / 0x10000;
    let numAsFloat = numWhole + numFrac;

    return `${sign}${numAsFloat.toFixed(16).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')}`;
}

function formatInfo(info) {
    const container = document.createElement("div");
    container.appendChild(formatTiles(info.tiles));
    container.appendChild(formatObjects(info.objects));
    return container;
}

function formatTiles(tiles) {
    const container = document.createElement("div");
    container.id = "tiles";
    container.className = "row";

    const table = document.createElement("table");
    container.appendChild(table);

    table.className = "table table-borderless";
    table.style.borderCollapse = "separate";
    table.style.borderSpacing = "1px";

    for (let j = 0; j < 5; ++j) {
        const tr = document.createElement("tr");
        table.appendChild(tr);

        for (let i = 0; i < 8; ++i) {
            const td = document.createElement("td");

            const idx = j * 8 + i;
            const tile = tiles[idx];

            td.style.borderColor = tile.visible
                ? !tile.owner
                    ? "red"
                    : "blue"
                : "black";
            td.style.borderWidth = "5px";
            td.style.borderStyle = "solid";

            td.appendChild(formatTile(idx, tile));

            tr.appendChild(td);
        }
    }
    return container;
}

function formatTile(i, tile) {
    const container = document.createElement("table");
    container.className = "table table-sm table-bordered";

    const tbody = document.createElement("tbody");
    container.appendChild(tbody);

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = `0x${(0x02039ae0 + i * 0x20)
            .toString(16)
            .padStart(8, "0")}`;
        th.colSpan = 2;
    }
    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "type";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${tile.type}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "anim";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${tile.animation}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "time";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${tile.timeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "flags";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${tile.flags
            .toString(16)
            .padStart(8, "0")}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "res";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `0x${tile.reserver
            .toString(16)
            .padStart(8, "0")}`;
    }

    return container;
}

function formatObjects(objects) {
    const container = document.createElement("div");
    container.id = "objects";
    container.className = "row";
    container.appendChild(formatTypedObjects(0, objects[0]));
    container.appendChild(formatTypedObjects(2, objects[2]));
    container.appendChild(formatTypedObjects(3, objects[3]));
    return container;
}

function formatTypedObjects(i, objects) {
    const container = document.createElement("div");
    container.className = "col";

    const heading = document.createElement("h3");
    heading.textContent = `type ${i + 1}`;
    container.appendChild(heading);

    for (let j = 0; j < objects.length; ++j) {
        if (objects[j].flags == 0) {
            continue;
        }
        container.appendChild(formatObject(i, j, objects[j]));
    }
    return container;
}

const COLORS = ["red", "", "blue", "green", ""];

function formatObject(i, j, object) {
    const container = document.createElement("table");
    container.className = "table table-sm table-bordered";

    const tbody = document.createElement("tbody");
    container.appendChild(tbody);

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = `${j + 1} @ 0x${object._addr
            .toString(16)
            .padStart(8, "0")}`;
        th.style.color = "white";
        th.style.backgroundColor = COLORS[i];
        th.colSpan = 2;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.style.width = "100px";
        th.textContent = "id+params";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.objid} (${object.param1}, ${object.param2}, ${object.param3}, ${object.param4})`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "pos";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `(${object.x}, ${object.y}) → (${object.nextx}, ${object.nexty})`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenx";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screenx)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenxvel";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screenxvel)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenx";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screeny)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenxvel";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screenyvel)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenx";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screenz)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "screenxvel";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${formatQ16_16(object.screenzvel)}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "state";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.state}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "anim";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.animation}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "attack";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `major=${object.attack
            .toString()
            .padStart(2, "0")} minor=${object.attackphase
            .toString()
            .padStart(2, "0")} init=${object.phaseinited}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "dragstate";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.dragstate}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "slidestate";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.slidestate}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "timers";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `t1=${object.timer1} t2=${object.timer2}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "hp";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${object.hp} / ${object.maxhp}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.textContent = "collision";
        const td = document.createElement("td");
        tr.appendChild(td);
        if (object.collision == null) {
            td.textContent = "—";
        } else {
            td.appendChild(formatCollision(object.collision));
        }
    }

    return container;
}

function formatCollision(collision) {
    const container = document.createElement("table");
    container.className = "table table-sm table-bordered";

    const tbody = document.createElement("tbody");
    container.appendChild(tbody);

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "pos";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `(${collision.x}, ${collision.y})`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "flags";
        const td = document.createElement("td");
        tr.appendChild(td);

        const ul = document.createElement("ul");
        ul.className = "list-unstyled";
        td.appendChild(ul);

        const flags = unpackcollflags(collision.flags);
        for (const k in flags) {
            const v = flags[k];
            const li = document.createElement("li");
            const label = document.createElement("label");
            li.appendChild(label);
            const cbox = document.createElement("input");
            label.appendChild(cbox);
            cbox.type = "checkbox";
            cbox.onclick = (e) => e.preventDefault();
            cbox.checked = v;
            label.appendChild(document.createTextNode(" " + k));
            ul.appendChild(li);
        }
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "paraleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.paralyzedtimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "cfusleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.confusedtimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "blndleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.blindedtimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "immoleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.immobilizedtimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "flshleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.flashingtimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "unk3left";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.unk03timeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "invnleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.invincibletimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "frznleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.frozentimeleft}`;
    }

    {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const th = document.createElement("th");
        th.style.width = "100px";
        tr.appendChild(th);
        th.textContent = "bublleft";
        const td = document.createElement("td");
        tr.appendChild(td);
        td.textContent = `${collision.bubbledtimeleft}`;
    }

    return container;
}