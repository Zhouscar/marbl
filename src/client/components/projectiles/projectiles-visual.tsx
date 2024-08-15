import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { CachedInstance, Positioner, world } from "shared/ecs";
import { onTick } from "shared/utils/per-frame";
import { getPositionerCurrent } from "shared/utils/positioner-utils";

export function ProjectilesVisual() {
	useEventListener(onTick, () => {
		for (const [e, positioner, { instance }] of world.query(Positioner, CachedInstance)) {
			const { currentPosition, currentVelocity } = getPositionerCurrent(positioner);
			instance.PivotTo(CFrame.lookAlong(currentPosition, currentVelocity));
		}
	});

	return <></>;
}
