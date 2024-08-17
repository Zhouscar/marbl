import { getPlayerE, onPlayerAdded, promisePlayerDisconnected } from "shared/utils/player-utils";
import { world } from "shared/world";

onPlayerAdded((player) => {
	const e = getPlayerE(player)!;
	promisePlayerDisconnected(player).andThen(() => {
		world.delete(e);
	});
});
