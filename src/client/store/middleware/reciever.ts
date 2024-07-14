import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { remotes } from "shared/remotes";

export function recieverMiddleware(): ProducerMiddleware {
	const reciever = createBroadcastReceiver({
		start: () => {
			remotes.store.start.fire();
		},
	});

	remotes.store.dispatch.connect((actions) => {
		reciever.dispatch(actions);
	});

	remotes.store.hydrate.connect((state) => {
		reciever.hydrate(state);
	});

	return reciever.middleware;
}
