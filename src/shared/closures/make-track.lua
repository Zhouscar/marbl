local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local world = TS.import(script, game:GetService("ReplicatedStorage"), "shared", "ecs", "world").world

local function shallowEq(a, b)
    for k, v in a do
        if b[k] ~= v then
            return false
        end
    end
    return true
end

local function makeTrack(component)
    local datas = {}
    local isTrivial = nil

    return function(fn)
        local added, removed = false, false

        local changes = {}
        function changes.added()
            added = true

            local q = world:query(component):drain()
            return function()
                local id, data = q:next()
                while true do
                    if not id then
                        return nil
                    end

                    if datas[tostring(id)] == nil then
                        break
                    end
                    
                    id, data = q:next()
                end

                if isTrivial == nil then
                    isTrivial = typeof(data) ~= "table"
                end
                
                if not isTrivial then
                    data = table.clone(data)
                end

                datas[tostring(id)] = data == nil and nil or "TAG"
                return id, data
            end
        end

        function changes.changed()
            local q = world:query(component):drain()
            return function()
                local id, data = q:next()
                local prevData
                while true do
                    if not id then
                        return nil
                    end

                    prevData = datas[tostring(id)]

                    if prevData ~= nil then
                        if not isTrivial then
                            if not shallowEq(data, prevData) then
                                break
                            end
                        elseif data ~= prevData and prevData ~= "TAG" then
                            break
                        end
                    end

                    id, data, prevData = q:next()
                end

                datas[tostring(id)] = data == nil and nil or "TAG"

                return id, data, prevData
            end
        end

        function changes.removed()
            removed = true

            local removedComponents = {}
            for idStr, _ in datas do
                if not world:has(tonumber(idStr), component) then
                    table.insert(removedComponents, tonumber(idStr))
                end
            end
            
            local i = 1
            return function()
                if i > #removedComponents then
                    return nil
                end
                
                i += 1

                local id = removedComponents[i - 1]
                local prevData = datas[tostring(id)]
                if prevData == "TAG" then
                    prevData = nil
                end
                datas[tostring(id)] = nil
                return id, prevData
            end
        end

        fn(changes)
        if not added then
            for _ in changes.added() do
                continue
            end
        end

        if not removed then
            for _ in changes.removed() do
                continue
            end
        end
    end
end

return {
	makeTrack = makeTrack
}