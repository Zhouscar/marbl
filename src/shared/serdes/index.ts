import { Entity } from "@rbxts/jecs";

export type ComponentDataContainer = {
	data?: unknown;
	isTag?: boolean;
	pair?: {
		first: Entity;
		second: Entity;
		secondIsEntity?: boolean;
	};
};
export type ReplicationMap = Map<string, Map<string, ComponentDataContainer>>;

export type ClientInitializedMap = Map<string, Player>;
