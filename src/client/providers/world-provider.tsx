import { Entity, World } from "@rbxts/jecs";
import React, { createContext } from "@rbxts/react";

export class WorldState {
	eMap: Map<string, Entity> = new Map();
}

export interface WorldProvider extends React.PropsWithChildren {
	worldState?: WorldState;
}

export const WorldContext = createContext<WorldProvider>({
	worldState: new WorldState(),
});

export function WorldProvider({ worldState: worldState = new WorldState(), children }: WorldProvider) {
	return <WorldContext.Provider value={{ worldState: worldState }}>{children}</WorldContext.Provider>;
}
