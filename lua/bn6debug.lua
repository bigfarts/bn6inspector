function unpackobjhdrflags(flags)
    return {
        active                  = AND(flags, 0x01) ~= 0,
        visible                 = AND(flags, 0x02) ~= 0,
        updateduringpause       = AND(flags, 0x04) ~= 0,
        hidesprite              = AND(flags, 0x08) ~= 0,
        updateduringtimestop    = AND(flags, 0x10) ~= 0,
        unk06                   = AND(flags, 0x20) ~= 0,
        unk07                   = AND(flags, 0x40) ~= 0,
        unk08                   = AND(flags, 0x80) ~= 0,
    }
end

function readobjandcollisions(mops, objptr)
    local obj = readobj(mops, objptr)
    obj.collision = nil
    if obj.collisionptr ~= 0 then
        obj.collision = readcollision(mops, obj.collisionptr)
    end
    return obj
end

function readobj(mops, objptr)
    return {
        flags        = mops.readu8(objptr + 0x00),
        objid        = mops.readu8(objptr + 0x01),
        objtype      = mops.readu8(objptr + 0x02),
        memidx       = mops.readu8(objptr + 0x03),
        param1       = mops.readu8(objptr + 0x04),
        param2       = mops.readu8(objptr + 0x05),
        param3       = mops.readu8(objptr + 0x06),
        param4       = mops.readu8(objptr + 0x07),
        state        = mops.readu8(objptr + 0x08),
        attack       = mops.readu8(objptr + 0x09),
        attackphase  = mops.readu8(objptr + 0x0a),
        phaseinited  = mops.readu8(objptr + 0x0b),
        dragstate    = mops.readu8(objptr + 0x0d),
        animation    = mops.readu8(objptr + 0x10),
        x            = mops.readu8(objptr + 0x12),
        y            = mops.readu8(objptr + 0x13),
        nextx        = mops.readu8(objptr + 0x14),
        nexty        = mops.readu8(objptr + 0x15),
        team         = mops.readu8(objptr + 0x16),
        flip         = mops.readu8(objptr + 0x17),
        slidestate   = mops.readu8(objptr + 0x1f),
        timer1       = mops.readu16(objptr + 0x20),
        timer2       = mops.readu16(objptr + 0x22),
        hp           = mops.readu16(objptr + 0x24),
        maxhp        = mops.readu16(objptr + 0x26),

        screenx = mops.readu32(objptr + 0x34),
        screeny = mops.readu32(objptr + 0x38),
        screenz = mops.readu32(objptr + 0x3c),

        parentptr = mops.readu32(objptr + 0x4c),
        childptr  = mops.readu32(objptr + 0x50),

        collisionptr = mops.readu32(objptr + 0x54),
    }
end

function unpackcollflags(flags)
    return {
        shielding       = bit.band(flags, 0x00000001) ~= 0,
        unk02           = bit.band(flags, 0x00000002) ~= 0,
        unk03           = bit.band(flags, 0x00000004) ~= 0,
        invincible      = bit.band(flags, 0x00000008) ~= 0,
        airshoes        = bit.band(flags, 0x00000010) ~= 0,
        floatshoes      = bit.band(flags, 0x00000020) ~= 0,
        cannotslide     = bit.band(flags, 0x00000040) ~= 0,
        unk08           = bit.band(flags, 0x00000080) ~= 0,
        dead            = bit.band(flags, 0x00000100) ~= 0,
        flashing        = bit.band(flags, 0x00000200) ~= 0,
        flinching       = bit.band(flags, 0x00000400) ~= 0,
        paralyzed       = bit.band(flags, 0x00000800) ~= 0,
        sliding         = bit.band(flags, 0x00001000) ~= 0,
        blinded         = bit.band(flags, 0x00002000) ~= 0,
        immobilized     = bit.band(flags, 0x00004000) ~= 0,
        confused        = bit.band(flags, 0x00008000) ~= 0,
        frozen          = bit.band(flags, 0x00010000) ~= 0,
        superarmor      = bit.band(flags, 0x00020000) ~= 0,
        undershirt      = bit.band(flags, 0x00040000) ~= 0,
        movedone        = bit.band(flags, 0x00080000) ~= 0,
        dragged         = bit.band(flags, 0x00100000) ~= 0,
        angry           = bit.band(flags, 0x00200000) ~= 0,
        usingaction     = bit.band(flags, 0x00400000) ~= 0,
        unk24           = bit.band(flags, 0x00800000) ~= 0,
        unk25           = bit.band(flags, 0x01000000) ~= 0,
        respectsice     = bit.band(flags, 0x02000000) ~= 0,
        ignorespoison   = bit.band(flags, 0x04000000) ~= 0,
        unk28           = bit.band(flags, 0x08000000) ~= 0,
        unk29           = bit.band(flags, 0x10000000) ~= 0,
        unk30           = bit.band(flags, 0x20000000) ~= 0,
        unk31           = bit.band(flags, 0x40000000) ~= 0,
        bubbled         = bit.band(flags, 0x80000000) ~= 0,
    }
end


function unpackcollflags2(flags)
    return {
        die             = bit.band(flags, 0x00000001) ~= 0,
        flash           = bit.band(flags, 0x00000002) ~= 0,
        flinch          = bit.band(flags, 0x00000004) ~= 0,
        paralyze        = bit.band(flags, 0x00000008) ~= 0,
        slide           = bit.band(flags, 0x00000010) ~= 0,
        blind           = bit.band(flags, 0x00000020) ~= 0,
        immobilize      = bit.band(flags, 0x00000040) ~= 0,
        confuse         = bit.band(flags, 0x00000080) ~= 0,
        drag            = bit.band(flags, 0x00000100) ~= 0,
        anger           = bit.band(flags, 0x00000200) ~= 0,
        unk11           = bit.band(flags, 0x00000400) ~= 0,
        unk12           = bit.band(flags, 0x00000800) ~= 0,
        unk13           = bit.band(flags, 0x00001000) ~= 0,
        unk14           = bit.band(flags, 0x00002000) ~= 0,
        unk15           = bit.band(flags, 0x00004000) ~= 0,
        unk16           = bit.band(flags, 0x00008000) ~= 0,
        freeze          = bit.band(flags, 0x00010000) ~= 0,
        bubble          = bit.band(flags, 0x00020000) ~= 0,
        unk19           = bit.band(flags, 0x00040000) ~= 0,
        unk20           = bit.band(flags, 0x00080000) ~= 0,
        unk21           = bit.band(flags, 0x00100000) ~= 0,
        unk22           = bit.band(flags, 0x00200000) ~= 0,
        unk23           = bit.band(flags, 0x00400000) ~= 0,
        unk24           = bit.band(flags, 0x00800000) ~= 0,
        unk25           = bit.band(flags, 0x01000000) ~= 0,
        unk26           = bit.band(flags, 0x02000000) ~= 0,
        unk27           = bit.band(flags, 0x04000000) ~= 0,
        unk28           = bit.band(flags, 0x08000000) ~= 0,
        unk29           = bit.band(flags, 0x10000000) ~= 0,
        unk30           = bit.band(flags, 0x20000000) ~= 0,
        unk31           = bit.band(flags, 0x40000000) ~= 0,
        unk32           = bit.band(flags, 0x80000000) ~= 0,
    }
end

function readcollision(mops, collisionptr)
    return {
        enabled = mops.readu8(collisionptr + 0x00),
        region = mops.readu8(collisionptr + 0x01),

        x = mops.readu8(collisionptr + 0x0a),
        y = mops.readu8(collisionptr + 0x0b),

        paralyzedtimeleft   = mops.readu16(collisionptr + 0x1c),
        confusedtimeleft    = mops.readu16(collisionptr + 0x1e),
        blindedtimeleft     = mops.readu16(collisionptr + 0x20),
        immobilizedtimeleft = mops.readu16(collisionptr + 0x22),
        flashingtimeleft    = mops.readu16(collisionptr + 0x24),
        unk03timeleft       = mops.readu16(collisionptr + 0x26),
        invincibletimeleft  = mops.readu16(collisionptr + 0x28),
        frozentimeleft      = mops.readu16(collisionptr + 0x2a),
        bubbledtimeleft     = mops.readu16(collisionptr + 0x2c),

        flags  = mops.readu32(collisionptr + 0x3c),
        flags2 = mops.readu32(collisionptr + 0x40),
    }
end

function readtile(mops, tileptr)
    return {
        visible         = mops.readu8(tileptr + 0x00),
        type            = mops.readu8(tileptr + 0x02),
        owner           = mops.readu8(tileptr + 0x03),
        animation       = mops.readu8(tileptr + 0x06),
        x               = mops.readu8(tileptr + 0x0a),
        y               = mops.readu8(tileptr + 0x0b),
        timeleft        = mops.readu16(tileptr + 0x0e),
        flags           = mops.readu32(tileptr + 0x14),
    }
end

function unpacktileflags(flags)
    return {
        enemyowned      = bit.band(flags, 0x00000020) ~= 0,
        movinginto      = bit.band(flags, 0x00000080) ~= 0,
        occupied2       = bit.band(flags, 0x00200000) ~= 0,
        occupied        = bit.band(flags, 0x04000000) ~= 0,
    }
end

-- type 1 objects start at 0203A9B0 and have size 0xd8
-- type 3 objects start at 0203CFE0 and have size 0xd8
-- type 4 objects start at 02038170 and have size 0xc8

function getobjtypespec(mops, type)
    local offset = type * 0x10
    local startptr = mops.readu32(0x080032d4 + offset)
    local endptr = mops.readu32(0x080032d8 + offset)
    local size = mops.readu8(0x080032dc + offset)
    return {
        startptr = startptr,
        endptr = endptr,
        size = size,
    }
end

local tileoffset = 0x02039AE0
local tilesize = 0x20

function dumpobjectdata(mops)
    local objects = {[1] = {}, [2] = {}, [3] = {}, [4] = {}, [5] = {}}
    for objtype, _  in ipairs(objects) do
        local objspec = getobjtypespec(mops, objtype)
        local os = objects[objtype]
        if objspec.startptr ~= 0 then
            for offset = objspec.startptr+0x10, objspec.endptr, objspec.size do
                local idx = (offset - objspec.startptr - 0x10) / objspec.size
                os[idx + 1] = readobjandcollisions(mops, offset)
            end
        end
    end
    return objects
end

function inbattle(mops)
    return mops.readu8(0x020093a4) ~= 0
end

-- tile ownership by column: 0x2034016 + 0x8 * colidx

function sendtoinspector(objects)
    local inspectoraddr = "http://localhost:9999/_data"
    local http = require("socket.http")
    local json = require("json")
    http.request(inspectoraddr, json.encode({objects = objects}))
end

return {
    inbattle = inbattle,
    dumpobjectdata = dumpobjectdata,
    sendtoinspector = sendtoinspector,
}
