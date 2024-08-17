import { Entity } from "@rbxts/jecs";
import { HasClientE } from "shared/components";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

const playersEMap: Map<Player, Map<string, Entity>> = new Map();

onTick.Connect(() => {
	playersEMap.forEach((map) => {
		map.forEach((serverE, key) => {
			if (!world.has(serverE, HasClientE)) {
				map.delete(key);
			}
		});
	});
});

function getServerEofPlayer(player: Player, clientE: Entity) {
	const map = playersEMap.get(player);
	if (map === undefined) return;

	const serverE = map.get(tostring(clientE));
	return serverE;
}

function setServerEofPlayer(player: Player, clientE: Entity, serverE: Entity) {
	let map = playersEMap.get(player);
	if (map === undefined) {
		map = new Map();
		playersEMap.set(player, map);
	}

	const prevE = map.get(tostring(clientE));
	if (prevE !== undefined) {
		world.remove(prevE, HasClientE);
	}

	map.set(tostring(clientE), serverE);
	world.add(serverE, HasClientE);
}

export function entityWithClientE(player: Player, clientE: Entity) {
	let e = getServerEofPlayer(player, clientE);
	if (e === undefined) {
		e = world.entity();
		setServerEofPlayer(player, clientE, e);
	}
	return e;
}
