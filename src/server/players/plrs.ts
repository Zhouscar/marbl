import {
	getCharE,
	getPlrE,
	onPlayerAdded,
	promisePlayerDisconnected,
} from "shared/utils/player-utils";
import { world } from "shared/world";

onPlayerAdded((player) => {
	const e = getPlrE(player)!;
	promisePlayerDisconnected(player).andThen(() => {
		const charE = getCharE(e);
		if (charE !== undefined) {
			world.delete(charE);
		}
		world.delete(e);
	});
});
