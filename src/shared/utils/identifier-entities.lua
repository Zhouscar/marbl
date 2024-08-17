local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local world = TS.import(script, game:GetService("ReplicatedStorage"), "shared", "world").world
local PseudoComponent = TS.import(script, game:GetService("ReplicatedStorage"), "shared", "components").PseudoComponent

local function makeIdentifierEntities(map)
	local identifierEntities = {}
	for key, _ in pairs(map) do
		local e = world:entity()
		world:add(e, PseudoComponent)
		identifierEntities[key] = e
	end
	return identifierEntities
end

return {
	makeIdentifierEntities = makeIdentifierEntities
}
