import { InitMarbl, world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { getPlayerE } from "shared/utils/player-utils";

remotes.players.spawn.connect((player) => {
	const playerE = getPlayerE(player)!;
	world.set(playerE, InitMarbl, {
		player: player,
		cf: new CFrame(0, 10, 0),
		color: Color3.fromRGB(255, 0, 0),
		material: Enum.Material.Metal,
		gadgets: [
			{ gadgetName: "test", rotationOffset: CFrame.fromEulerAnglesYXZ(0, 0, 0) },
			// { gadgetName: "test", rotationOffset: CFrame.fromEulerAnglesYXZ(0, math.pi, 0) },
		],
	});
});
