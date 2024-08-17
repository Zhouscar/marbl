import { Workspace } from "@rbxts/services";
import {
	AnotherHost,
	InitProjectileHit,
	IsProjectile,
	Positioner,
	PremadeRaycastParams,
	world,
} from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";
import { getPositionerCurrent } from "shared/utils/positioner-utils";

scheduleTick((dt) => {
	for (const [e, positioner, params] of world
		.query(Positioner, PremadeRaycastParams, IsProjectile)
		.without(AnotherHost, InitProjectileHit)) {
		const { currentPosition, currentVelocity } = getPositionerCurrent(positioner);
		const result = Workspace.Raycast(currentPosition, currentVelocity.mul(dt), params);
		if (result === undefined) continue;

		world.set(e, InitProjectileHit, {
			position: currentPosition,
			direction: currentVelocity,
		});
	}
});
