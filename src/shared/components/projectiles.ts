import { Entity } from "@rbxts/jecs";
import { Replicated, ReplicatedPair } from "./network";
import { world } from "shared/world";

export const IsProjectile = world.component<undefined>();
world.add(IsProjectile, Replicated);

export const InitProjectile = world.component<{
	player?: Player;
	creatorE?: Entity;
	creatorGadgetE?: Entity;
	startTime: number;
	position: Vector3;
	velocity: Vector3;
	acceleration: Vector3;
	duration: number;
}>();

export const ProjectileEndTime = world.component<number>();
world.add(ProjectileEndTime, Replicated);

export const ProjectileByGadget = world.component();
world.add(ProjectileByGadget, ReplicatedPair);

export const ProjectileByCreator = world.component();
world.add(ProjectileByCreator, ReplicatedPair);

export const ProjectileDamageWhenHit = world.component<number>();
world.add(ProjectileDamageWhenHit, Replicated);

export const InitProjectileHit = world.component<{
	position: Vector3;
	direction: Vector3;
	hitByE?: Entity;
}>();

export const ProjectileHitCF = world.component<CFrame>();
world.add(ProjectileHitCF, Replicated);

export const ProjectileHitBy = world.component();
world.add(ProjectileHitBy, Replicated);
