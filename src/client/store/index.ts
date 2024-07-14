import { combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";
import { recieverMiddleware } from "./middleware/reciever";

export function createStore() {
	const store = combineProducers({ ...slices });

	store.applyMiddleware(recieverMiddleware());

	return store;
}

export const store = createStore();
