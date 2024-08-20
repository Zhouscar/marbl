import { Workspace } from "@rbxts/services";
import {
	AnotherHost,
	InitProjectileHit,
	IsProjectile,
	Positioner,
	PremadeRaycastParams,
} from "shared/components";
import { getEFromPart } from "shared/position-velocity/part-to-e";

import { scheduleTick } from "shared/utils/per-frame";
import { getPositionerCurrent } from "shared/utils/positioner-utils";
import { world } from "shared/world";

scheduleTick((dt) => {
	for (const [e, positioner, params] of world
		.query(Positioner, PremadeRaycastParams, IsProjectile)
		.without(AnotherHost, InitProjectileHit)) {
		const { currentPosition, currentVelocity } = getPositionerCurrent(positioner);
		const stepVector = currentVelocity.mul(dt);
		const result = Workspace.Raycast(
			currentPosition.sub(stepVector.div(2)),
			stepVector,
			params,
		);
		if (result === undefined) continue;

		const hitByE = !result.Instance.IsA("BasePart") ? undefined : getEFromPart(result.Instance);

		world.set(e, InitProjectileHit, {
			position: currentPosition,
			direction: currentVelocity,
			hitByE,
		});
	}
});
