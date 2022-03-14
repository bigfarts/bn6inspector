-- Using this script (only tested on US BN6 Falzar/Gregar):
--
-- 1. ???
-- 2. Click on "Tools > Lua Console", in the Lua window click on "Script > Open Script..." and load this script.
-- 3. Enter a battle and it should output a bunch of debug info.
--
-- If you want to use bn6inspector with this, set USE_INSPECTOR = true.
--
-- Thanks to https://twitter.com/pnw_ssbmars for porting this to Bizhawk!
bn6debug = require('bn6debug')

USE_INSPECTOR = false

local xpad = 140
local ypad = 140
local xend = 240+xpad

local red = 0xFFFF4040
local blue = 0xFF30D0FF

client.SetGameExtraPadding(xpad,0,xpad,ypad) -- (left, top, right, bottom)
gui.defaultPixelFont("fceux")
gui.defaultTextBackground(0x00000000)

MOPS = {
    readu8 = memory.read_u8
    reads8 = memory.read_s8
    readu16 = memory.read_u16_le
    reads16 = memory.read_s16_le
    readu32 = memory.read_u32_le
    reads32 = memory.read_s32_le
}

local objects = nil
event.onframestart(function()
    if bn6debug.inbattle(MOPS) ~= 0 then
        objects = bn6debug.dumpobjectdata(MOPS)
    else
        objects = nil
    end
end)

function drawobjectsinfo(os, x, color)
    local yoff = 0
    for idx, obj in ipairs(os) do
        if obj.flags ~= 0 then
            local s = "%2d: (%d, %d) -> (%d, %d)\n    attack = %02d:%02d\n    anim   = %02d"
            s = string.format(s, idx, obj.x, obj.y, obj.nextx, obj.nexty, obj.attack, obj.attackphase, obj.animation)
            gui.pixelText(x, 2 + 32*yoff, s, color)
            yoff = yoff + 1
        end
    end
end

function drawobjectsmarkers(os, x, color)
    for idx, obj in ipairs(os) do
        if obj.flags ~= 0 then
            local s = string.format("%d", idx)
            gui.pixelText(xpad+(obj.x-1)*40+40/2-#s*2+1, 72+(obj.y-1)*24+24/4+2, s, "white", color)
        end
    end
end

-- By default, this loop runs at the end of every frame.
-- Bizhawk lua scripts must continue to run code or else they will completely stop
-- and any registered events created by the script will be removed.
-- So it's standard to have a while loop like this.
while true do
    if objects ~= nil then
        if USE_INSPECTOR then
            bn6debug.sendtoinspector(objects)
        end
        drawobjectsinfo(objects[1], 2, red)
        drawobjectsinfo(objects[3], 2 + xend, blue)
        drawobjectsmarkers(objects[1], 2, red)
        drawobjectsmarkers(objects[3], 2 + xend, blue)
    end
    -- always run the frameadvance as the last line in the script's while loop
    emu.frameadvance()
end
