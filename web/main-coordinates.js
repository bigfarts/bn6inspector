
function onDataMessage(e) {
    let preElem = document.getElementById("contents");

    info = JSON.parse(e.data);
    let allObjects = info.objects;
    for (const objType of [0, 2, 3]) {
        let output = "";
        output += `== T${objType+1} Objects ==\n`;
        objects = allObjects[objType];
        for (let j = 0; j < objects.length; ++j) {
            if (objects[j].flags == 0) {
                continue;
            }
            let object = objects[j];
            output += (j + 1).toString().padStart(2, ' ') + ":\n";
            output += `  pos: (${object.x}, ${object.y}) → (${object.nextx}, ${object.nexty})\n`;
            output += `     screenx: ${formatQ16_16(object.screenx)}\n`;
            output += `  screenxvel: ${formatQ16_16(object.screenxvel)}\n`;
            output += `     screeny: ${formatQ16_16(object.screeny)}\n`;
            output += `  screenyvel: ${formatQ16_16(object.screenyvel)}\n`;
            output += `     screenz: ${formatQ16_16(object.screenz)}\n`;
            output += `  screenzvel: ${formatQ16_16(object.screenzvel)}\n`;
        }
        let preElem = document.getElementById(`obj-${objType}`);
        preElem.textContent = output;
    }
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

function createInfo() {
    let main = document.getElementById("main");
    const container = document.createElement("div");
    container.id = "objects";
    container.className = "row";

    for (const objType of [0, 2, 3]) {
        let preElem = document.createElement("pre");
        preElem.id = `obj-${objType}`;
        preElem.className = "col";
        container.append(preElem);
    }
    main.append(container);
}

const source = new EventSource("/_data");
source.onmessage = onDataMessage;
createInfo();

