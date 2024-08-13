import { world } from "shared/ecs";
import { getPlayerE, onPlayerAdded, promisePlayerDisconnected } from "shared/utils/player-utils";

onPlayerAdded((player) => {
	const e = getPlayerE(player)!;
	promisePlayerDisconnected(player).andThen(() => {
		world.clear(e);
	});
});
