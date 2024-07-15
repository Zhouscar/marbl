import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { recieverMiddleware } from "./middleware/reciever";

export type RootStore = typeof store;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({ ...slices });

	store.applyMiddleware(recieverMiddleware());

	return store;
}

export const store = createStore();
