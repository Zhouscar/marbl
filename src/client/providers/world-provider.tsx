import { Entity, World } from "@rbxts/jecs";
import React, { createContext } from "@rbxts/react";

export class State {
	clientToServerEMap: Map<string, Entity> = new Map();
	serverToClientEMap: Map<string, Entity> = new Map();
}

export interface WorldProvider extends React.PropsWithChildren {
	state?: State;
}

export const WorldContext = createContext<WorldProvider>({
	state: new State(),
});

export function WorldProvider({ state = new State(), children }: WorldProvider) {
	return <WorldContext.Provider value={{ state: state }}>{children}</WorldContext.Provider>;
}
