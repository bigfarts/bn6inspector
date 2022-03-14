-- Using this script (only tested on US BN6 Falzar/Gregar):
--
-- 1. Download vba-rerecording: https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/vba-rerecording/vba-rerecording-svn480-win32.7z
-- 2. Click on "Tools > Lua Scripting > New Lua Script Window..." and load this script.
-- 3. Run bn6inspector.exe.
-- 4. Go to http://localhost:9999
bn6debug = require('bn6debug')

MOPS = {
    readu8 = memory.readbyteunsigned,
    reads8 = memory.readbyte,
    readu16 = memory.readshortunsigned,
    reads16 = memory.readshort,
    readu32 = memory.readlongunsigned,
    reads32 = memory.readlong,
}

local objects = nil
vba.registerbefore(function()
    if bn6debug.inbattle(MOPS) ~= 0 then
        objects = bn6debug.dumpobjectdata(MOPS)
    else
        objects = nil
    end
end)

function drawobjectsmarkers(os, x, color)
    for idx, obj in ipairs(os) do
        if obj.flags ~= 0 then
            local s = string.format("%d", idx)
            gui.text((obj.x-1)*40+40/2-#s*2+1, 72+(obj.y-1)*24+24/4+2, s, 0xffffffff, color)
        end
    end
end

gui.register(function()
    if objects ~= nil then
        bn6debug.sendtoinspector(objects)
        drawobjectsmarkers(objects[1], 2, 0xff0000ff)
        drawobjectsmarkers(objects[3], 2 + 120, 0x0000ffff)
    end
end)
