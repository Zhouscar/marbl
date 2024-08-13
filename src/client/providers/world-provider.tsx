import { Entity } from "@rbxts/jecs";
import React, { createContext } from "@rbxts/react";

export class WorldState {
	eMap: Map<string, Entity> = new Map();

	cameraDistance: number = 20;
	rotationX: number = 0;
	rotationY: number = 0;

	pointAt: Vector3 = Vector3.zero;
	activated: boolean = false;
}

export interface WorldProvider extends React.PropsWithChildren {
	worldState?: WorldState;
}

export const WorldContext = createContext<WorldProvider>({
	worldState: new WorldState(),
});

export function WorldProvider({
	worldState: worldState = new WorldState(),
	children,
}: WorldProvider) {
	return (
		<WorldContext.Provider value={{ worldState: worldState }}>{children}</WorldContext.Provider>
	);
}
