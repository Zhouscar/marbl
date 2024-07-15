import { Entity, Nullable, World } from "@rbxts/jecs";

interface Changes<T = unknown> {
	added(this: Changes<T>): IterableFunction<LuaTuple<[Entity, T]>>;
	changed(this: Changes<T>): IterableFunction<LuaTuple<[Entity, T, T]>>;
	removed(this: Changes<T>): IterableFunction<LuaTuple<[Entity]>>;
}

export type TrackFunction<T = unknown> = (fn: (changes: Changes<T>) => void) => void;

export function makeTrack<T = unknown>(component: Entity<T>): TrackFunction<T>;
