local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "src")
local world = TS.import(script, game:GetService("ReplicatedStorage"), "shared", "ecs", "world").world
local Wildcard = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "src").Wildcard

local function shallowEq(a, b)
    for k, v in a do
        if b[k] ~= v then
            return false
        end
    end
    return true
end

local function makeTrackPairWildCard(component)
    local pairDatas = {}
    local isTrivial = nil
    local Pair = jecs.pair(component, Wildcard)

    return function(fn)
        local added, removed = false, false

        local changes = {}
        function changes.added()
            added = true

            local q = world:query(Pair):drain()
            return function()
                local id, data = q:next()
                local target
                while true do
                    if not id then
                        return nil
                    end

                    if pairDatas[tostring(id)] == nil then
                        pairDatas[tostring(id)] = {}
                    end

                    target = world:target(id, component)

                    if target ~= nil and pairDatas[tostring(id)][tostring(target)] == nil then
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
                
                pairDatas[tostring(id)][tostring(target)] = data ~= nil and data or "TAG"
                return id, target, data
            end
        end

        function changes.changed()
            local q = world:query(Pair):drain()
            return function()
                local id, data = q:next()
                local prevData, target
                while true do
                    if not id then
                        return nil
                    end

                    target = world:target(id, component)

                    if target ~= nil then
                        prevData = pairDatas[tostring(id)][tostring(target)]

                        if prevData ~= nil then
                            if not isTrivial then
                                if not shallowEq(data, prevData) then
                                    break
                                end
                            elseif data ~= prevData and prevData ~= "TAG" then
                                break
                            end
                        end
                    end

                    id, data = q:next()
                end

                pairDatas[tostring(id)][tostring(target)] = data ~= nil and data or "TAG"
                return id, target, data, prevData
            end
        end

        function changes.removed()
            removed = true

            local removedPairs = {}
            for idStr, datas in pairDatas do
                for targetStr, _ in datas do
                    if not world:has(tonumber(idStr), jecs.pair(component, tonumber(targetStr))) then
                        table.insert(removedPairs, { id = tonumber(idStr), target = tonumber(targetStr) })
                    end
                end
            end
            
            local i = 1
            return function()
                if i > #removedPairs then
                    return nil
                end
                
                i += 1

                local id = removedPairs[i - 1].id
                local target = removedPairs[i - 1].target
                local prevData = pairDatas[tostring(id)][tostring(target)]
                if prevData == "TAG" then
                    prevData = nil
                end
                pairDatas[tostring(id)][tostring(target)] = nil

                if next(pairDatas[tostring(id)]) == nil then
                    pairDatas[tostring(id)] = {}
                end
                return id, target, prevData
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
	makeTrackPairWildCard = makeTrackPairWildCard
}