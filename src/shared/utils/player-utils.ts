import { Entity, pair } from "@rbxts/jecs";
import { Players, RunService } from "@rbxts/services";
import { Plr, PlrOf } from "shared/components";
import { IS_SERVER } from "shared/constants/core";
import { world } from "shared/world";

// const characterSchema = {
// 	$className: "Model",
// 	HumanoidRootPart: "BasePart",
// 	Humanoid: {
// 		$className: "Humanoid",
// 		Animator: "Animator",
// 	},
// } as const;

// export interface Character extends Model {
// 	HumanoidRootPart: BasePart;
// 	Humanoid: Humanoid & {
// 		Animator: Animator;
// 	};
// }

// export async function promiseCharacter(character: Model): Promise<Character> {
// 	return promiseTree(character, characterSchema).timeout(30, "Character timed out");
// }

export function getPlrE(player: Player) {
	for (const [e, _player] of world.query(Plr)) {
		if (_player !== player) continue;
		return e;
	}

	if (IS_SERVER) {
		const e = world.entity();
		world.set(e, Plr, player);
		return e;
	}
}

export function getCharE(plrE: Entity) {
	for (const [e] of world.query(pair(PlrOf, plrE))) {
		return e;
	}
}

export async function promisePlayerDisconnected(player: Player): Promise<void> {
	if (!player.IsDescendantOf(Players)) {
		return;
	}

	await Promise.fromEvent(Players.PlayerRemoving, (playerWhoLeft) => playerWhoLeft === player);
}

export function getPlayerByName(name: string) {
	const player = Players.FindFirstChild(name);

	if (player?.IsA("Player")) {
		return player;
	}
}

export function onPlayerAdded(callback: (player: Player) => void) {
	const connection = Players.PlayerAdded.Connect(callback);

	for (const player of Players.GetPlayers()) {
		callback(player);
	}

	return () => connection.Disconnect();
}
