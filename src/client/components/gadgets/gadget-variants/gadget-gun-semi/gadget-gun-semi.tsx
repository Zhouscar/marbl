import { pair } from "@rbxts/jecs";
import React, { useEffect } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useLocalCharE } from "client/hooks/use-local-char-e";
import { useStated } from "client/hooks/use-stated";
import { useWorldState } from "client/hooks/use-world-state";
import {
	GadgetOf,
	GadgetVariantAs,
	GunOfGadget,
	InitProjectile,
	VariantOfGadget,
} from "shared/components";
import { LAST_E } from "shared/constants/core";
import { GadgetVariantIdEs } from "shared/gadgets";
import { gameTime } from "shared/utils/time-utils";
import { world } from "shared/world";

export function Gadget_Gun_Semi() {
	const localCharE = useLocalCharE();
	const worldState = useWorldState();

	const activated = useStated(worldState, "activated");

	useEffect(() => {
		if (localCharE === LAST_E) return;
		if (!activated) return;

		for (const [_, { shootPart }, variant] of world.query(
			GunOfGadget,
			VariantOfGadget,
			pair(GadgetVariantAs, GadgetVariantIdEs.gun_semi),
			pair(GadgetOf, localCharE),
		)) {
			assert(variant.type === "gun_semi");

			const { damage, speed, lifetime } = variant;

			// TODO: cooldown

			world.set(world.entity(), InitProjectile, {
				player: Players.LocalPlayer,
				creatorE: localCharE,
				startTime: gameTime(),
				position: shootPart.Position,
				velocity: shootPart.CFrame.LookVector.mul(speed),
				acceleration: Vector3.zero,
				damage,
				duration: lifetime,
			});
		}
	}, [localCharE, activated]);
	return <></>;
}
