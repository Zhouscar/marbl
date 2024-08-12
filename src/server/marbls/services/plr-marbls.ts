import { InitMarbl, world } from "shared/ecs";
import { remotes } from "shared/remotes";

remotes.players.spawn.connect((player) => {
	world.set(world.entity(), InitMarbl, {
		player: player,
		cf: new CFrame(0, 10, 0),
		color: Color3.fromRGB(255, 0, 0),
		material: Enum.Material.Metal,
		gadgets: [
			{ gadgetType: "test", rotationOffset: CFrame.fromEulerAnglesYXZ(0, 0, 0) },
			{ gadgetType: "test", rotationOffset: CFrame.fromEulerAnglesYXZ(0, math.pi, 0) },
		],
	});
});
