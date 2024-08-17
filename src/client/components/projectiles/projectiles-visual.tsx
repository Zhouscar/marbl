import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { CachedInstance, Positioner } from "shared/components";
import { onTick } from "shared/utils/per-frame";
import { getPositionerCurrent } from "shared/utils/positioner-utils";
import { world } from "shared/world";

export function ProjectilesVisual() {
	useEventListener(onTick, () => {
		for (const [e, positioner, { instance }] of world.query(Positioner, CachedInstance)) {
			const { currentPosition, currentVelocity } = getPositionerCurrent(positioner);
			instance.PivotTo(CFrame.lookAlong(currentPosition, currentVelocity));
		}
	});

	return <></>;
}
