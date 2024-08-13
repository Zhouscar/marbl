import { world } from "../world";
import { Replicated } from "./network";

export const Positioner = world.component<{
	startTime: number;
	initialPosition: Vector3;
	initialVelocity: Vector3;
	acceleration: Vector3;
}>();
world.add(Positioner, Replicated);
