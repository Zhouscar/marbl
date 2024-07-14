import React from "@rbxts/react";
import { WorldProvider } from "./world-provider";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/store";

interface RootProvider extends WorldProvider {}

export function RootProvider({ state, children }: RootProvider) {
	return (
		<ReflexProvider producer={store}>
			<WorldProvider state={state}>{children}</WorldProvider>
		</ReflexProvider>
	);
}
