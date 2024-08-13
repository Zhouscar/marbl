import { Entity } from "@rbxts/jecs";
import { world } from "../world";
import { ReplicatedPair } from "./network";

export const InitProjectile = world.component<{
	player?: Player;
	creator?: Entity;
	startTime: number;
	position: Vector3;
	velocity: Vector3;
	acceleration: Vector3;
}>();

export const ProjectileBy = world.component();
world.add(ProjectileBy, ReplicatedPair);
