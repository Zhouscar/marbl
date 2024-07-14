import { createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";

export function broadcasterMiddleware() {
	const hydrated = new Set<number>();

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatchRate: 1 / 20,
		hydrateRate: 60,
		dispatch: (player, actions) => {
			remotes.store.dispatch.fire(player, actions);
		},
		hydrate: (player, state) => {
			remotes.store.hydrate.fire(player, state);
		},
	});

	remotes.store.start.connect((player) => {
		broadcaster.start(player);
	});

	Players.PlayerRemoving.Connect((player) => {
		hydrated.delete(player.UserId);
	});

	return broadcaster.middleware;
}
