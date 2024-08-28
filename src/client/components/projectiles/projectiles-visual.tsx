import React from "@rbxts/react";
import { useOnTick } from "client/hooks/use-on-tick";
import { CachedInstance, Positioner } from "shared/components";
import { getPositionerCurrent } from "shared/utils/positioner-utils";
import { world } from "shared/world";

export function ProjectilesVisual() {
	useOnTick(() => {
		for (const [e, positioner, { instance }] of world.query(Positioner, CachedInstance)) {
			const { currentPosition, currentVelocity } = getPositionerCurrent(positioner);
			instance.PivotTo(CFrame.lookAlong(currentPosition, currentVelocity));
		}
	});

	return <></>;
}
