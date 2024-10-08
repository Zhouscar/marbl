import { InitMarbl } from "shared/components";
import { remotes } from "shared/remotes";
import { getPlrE } from "shared/utils/player-utils";
import { world } from "shared/world";

remotes.players.spawn.connect((player) => {
	const playerE = getPlrE(player)!;
	world.set(playerE, InitMarbl, {
		health: 100,
		player: player,
		cf: new CFrame(0, 10, 0),
		color: Color3.fromRGB(100, 100, 100),
		material: Enum.Material.Metal,
		gadgets: [
			{ gadgetName: "test", rotationOffset: CFrame.fromEulerAnglesYXZ(0, 0, 0) },
			{ gadgetName: "testMelee", rotationOffset: CFrame.fromEulerAnglesYXZ(0, math.pi, 0) },
		],
	});
});
