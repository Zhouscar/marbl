import { EntityType } from "@rbxts/jecs";
import { Positioner } from "shared/ecs";
import { gameTime } from "./time-utils";

export function getPositionerCurrent(positioner: EntityType<typeof Positioner>) {
	const timePassed = gameTime() - positioner.startTime;
	const currentPosition = positioner.initialPosition
		.add(positioner.initialVelocity.mul(timePassed))
		.add(positioner.acceleration.div(2).mul(timePassed * timePassed));
	const currentVelocity = positioner.initialVelocity.add(positioner.acceleration.mul(timePassed));
	return {
		currentPosition,
		currentVelocity,
	};
}
