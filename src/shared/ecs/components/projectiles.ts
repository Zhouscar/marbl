import { Entity } from "@rbxts/jecs";
import { world } from "../world";
import { ReplicatedPair } from "./network";

export const InitProjectile = world.component<{
	player?: Player;
	creatorE?: Entity;
	creatorGadgetE?: Entity;
	startTime: number;
	position: Vector3;
	velocity: Vector3;
	acceleration: Vector3;
}>();

export const ProjectileByGadget = world.component();
world.add(ProjectileByGadget, ReplicatedPair);

export const ProjectileByCreator = world.component();
world.add(ProjectileByCreator, ReplicatedPair);
