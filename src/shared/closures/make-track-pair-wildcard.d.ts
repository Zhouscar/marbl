import { Entity, Nullable, World } from "@rbxts/jecs";

interface Changes<T = unknown> {
	added(this: Changes<T>): IterableFunction<LuaTuple<[Entity, Entity, T]>>;
	changed(this: Changes<T>): IterableFunction<LuaTuple<[Entity, Entity, T, T]>>;
	removed(this: Changes<T>): IterableFunction<LuaTuple<[Entity, Entity, T]>>;
}

export type TrackPairWildCardFunction<T = unknown> = (fn: (changes: Changes<T>) => void) => void;

export function makeTrackPairWildCard<T = unknown>(component: Entity<T>): TrackPairWildCardFunction<T>;
