import { Entity } from "@rbxts/jecs";

export function makeIdentifierEntities<T extends { [key: string]: unknown }>(
	map: T,
): { [P in keyof T & string]: Entity };
