import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootState = InferState<typeof store>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(broadcasterMiddleware());

	return store;
}

export const store = createStore();
