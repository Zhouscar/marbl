import React from "@rbxts/react";
import { WorldProvider, WorldState } from "./world-provider";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/store";

interface RootProvider extends WorldProvider {}

export function RootProvider({ worldState, children }: RootProvider) {
	return (
		<ReflexProvider producer={store}>
			<WorldProvider worldState={worldState}>{children}</WorldProvider>
		</ReflexProvider>
	);
}
