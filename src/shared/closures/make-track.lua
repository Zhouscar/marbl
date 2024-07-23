local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "src")
local world = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").world

local function shallowEq(a, b)
    for k, v in a do
        if b[k] ~= v then
            return false
        end
    end
    return true
end

local function makeTrack(component)
    local components = {}
    local isTrivial = nil

    return function(fn)
        local added, removed = false, false

        local changes = {}
        function changes.added()
            added = true

            local q = world:query(component)
            return function()
                local id, data = q:next()
                while true do
                    if not id then
                        return nil
                    end

                    if components[tostring(id)] == nil then
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

                components[tostring(id)] = data
                return id, data
            end
        end

        function changes.changed()
            local q = world:query(component)
            return function()
                local id, data = q:next()
                local prevData
                while true do
                    if not id then
                        return nil
                    end

                    prevData = components[tostring(id)]

                    if prevData ~= nil then
                        if not isTrivial then
                            if not shallowEq(data, prevData) then
                                break
                            end
                        elseif data ~= prevData then
                            break
                        end
                    end

                    id, data, prevData = q:next()
                end

                components[tostring(id)] = data

                return id, data, prevData
            end
        end

        function changes.removed()
            removed = true

            local removedComponents = {}
            for idStr, _ in components do
                if world:get(tonumber(idStr), component) == nil then
                    table.insert(removedComponents, tonumber(idStr))
                    components[idStr] = nil
                end
            end

            local i = 1
            return function()
                if i > #removedComponents then
                    return nil
                end
                
                i += 1
                return removedComponents[i - 1]
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