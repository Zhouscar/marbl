local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "src")
local world = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").world

local Previous = world:component()

local function shallowEq(a, b)
    for k, v in a do
        if b[k] ~= v then
            return false
        end
    end
    return true
end

function makeTrack(component)
    local addedComponents = {}
    local removedComponents = {}
    local previous = jecs.pair(Previous, component)
    local isTrivial = nil

    return function(fn)
            local added = false
            local removed = false

            local changes = {}
            function changes:added()
                added = true
                local q = world:query(component):without(previous)
                return function()
                    local id, data = q:next()
                    if not id then
                        return nil
                    end

                    if isTrivial == nil then
                        isTrivial = typeof(data) ~= "table"
                    end

                    if not isTrivial then
                        data = table.clone(data)
                    end

                    addedComponents[id] = data
                    return id, data
                end
            end

            function changes:changed()
                local q = world:query(component, previous)

                return function()
                    local id, new, old = q:next()
                    while true do
                        if not id then
                            return nil
                        end

                        if not isTrivial then
                            if not shallowEq(new, old) then
                                break
                            end
                        elseif new ~= old then
                            break
                        end

                        id, new, old = q:next()
                    end
                    addedComponents[id] = new

                    return id, new, old
                end
            end

            function changes:removed()
                removed = true

                local q = world:query(previous):without(component)

                return function()
                    local id = q:next()
                    if id then
                        table.insert(removedComponents, id)
                    end
                    return id
                end
            end

            fn(changes)
            if not added then
                for _ in changes:added() do
                    continue
                end
            end

            if not removed then
                for _ in changes:removed() do
                    continue
                end
            end

            -- local entityIndex = world.entityIndex
            for e, data in addedComponents do
                world:set(e, previous, if isTrivial then data else table.clone(data))
            end

            for _, e in removedComponents do
                world:remove(e, previous)
            end
    end
end

return {
	makeTrack = makeTrack
}