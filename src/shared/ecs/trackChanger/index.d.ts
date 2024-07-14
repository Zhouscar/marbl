import { Entity, World } from "@rbxts/jecs";

interface Changes<T> {
	added(this: void): IterableFunction<LuaTuple<[Entity, Entity<T>]>>;
	changed(this: void): IterableFunction<LuaTuple<[Entity, Entity<T>, Entity<T>]>>;
	removed(this: void): IterableFunction<LuaTuple<[Entity]>>;
}

export declare class ChangeTracker<T> {
	public constructor(component: Entity<T>);

	track(fn: (changes: Changes<T>) => void): void;
}
