import { pair } from "@rbxts/jecs";
import React, { useEffect } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useLocalE } from "client/hooks/use-local-e";
import { useStated } from "client/hooks/use-stated";
import { useWorldState } from "client/hooks/use-world-state";
import { GadgetOf, GadgetVariantAs, GunOfGadget, InitProjectile } from "shared/components";
import { LAST_E } from "shared/constants/core";
import { GadgetVariantIdEs } from "shared/gadgets";
import { gameTime } from "shared/utils/time-utils";
import { world } from "shared/world";

export function Gadget_Gun_Semi() {
	const localE = useLocalE();
	const worldState = useWorldState();

	const activated = useStated(worldState, "activated");

	useEffect(() => {
		if (localE === LAST_E) return;
		if (!activated) return;

		for (const [e, context] of world.query(
			GunOfGadget,
			pair(GadgetVariantAs, GadgetVariantIdEs.gun_semi),
			pair(GadgetOf, localE),
		)) {
			world.set(world.entity(), InitProjectile, {
				player: Players.LocalPlayer,
				creatorE: localE,
				startTime: gameTime(),
				position: context.shootPart.Position,
				velocity: context.shootPart.GetPivot().LookVector.mul(100),
				acceleration: Vector3.zero,
				duration: 1,
			});
		}
	}, [localE, activated]);
	return <></>;
}
