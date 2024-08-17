import { Entity } from "@rbxts/jecs";
import { world } from "../world";

export const Replicated = world.component<undefined>();
export const ReplicatedPair = world.component<undefined>();

export const ServerE = world.component<Entity>();

export const HasClientE = world.component<undefined>();

export const AnotherHost = world.component<undefined>();

export const PseudoComponent = world.component<undefined>();
