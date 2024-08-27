import { pair } from "@rbxts/jecs";
import React, { useEffect } from "@rbxts/react";
import { createMotion } from "@rbxts/ripple";
import { useLocalCharE } from "client/hooks/use-local-char-e";
import { useStated } from "client/hooks/use-stated";
import { useWorldState } from "client/hooks/use-world-state";
import {
	GadgetImplicitAngularYMotion,
	GadgetOf,
	GadgetVariantAs,
	MeleeOfGadget,
	VariantOfGadget,
} from "shared/components";
import { LAST_E } from "shared/constants/core";
import { GadgetVariantIdEs } from "shared/gadgets";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

function closestMultiple(a: number, b: number): number {
	const k = math.round(a / b);
	return k * b;
}

export function Gadget_Melee_Spin() {
	const localCharE = useLocalCharE();
	const worldState = useWorldState();

	const activated = useStated(worldState, "activated");

	useEffect(() => {
		if (localCharE === LAST_E) return;

		for (const [e, _] of world
			.query(
				MeleeOfGadget,
				pair(GadgetVariantAs, GadgetVariantIdEs.melee_spin),
				pair(GadgetOf, localCharE),
			)
			.without(GadgetImplicitAngularYMotion)) {
			const motion = createMotion(0);
			// motion.start();
			world.set(e, GadgetImplicitAngularYMotion, { goal: 0, api: motion });
		}

		if (activated) {
			const disconnect = onTick((dt) => {
				for (const [e, { api, goal }, variant] of world.query(
					GadgetImplicitAngularYMotion,
					VariantOfGadget,
					MeleeOfGadget,
					pair(GadgetVariantAs, GadgetVariantIdEs.melee_spin),
					pair(GadgetOf, localCharE),
				)) {
					assert(variant.type === "melee_spin");

					world.set(e, GadgetImplicitAngularYMotion, {
						goal: goal + dt * variant.spinSpeed,
						api,
					});
				}
			});

			return disconnect;
		} else {
			for (const [e, { api, goal }] of world.query(
				GadgetImplicitAngularYMotion,
				MeleeOfGadget,
				pair(GadgetVariantAs, GadgetVariantIdEs.melee_spin),
				pair(GadgetOf, localCharE),
			)) {
				world.set(e, GadgetImplicitAngularYMotion, {
					goal: closestMultiple(goal, math.pi * 2),
					api,
				});
			}
		}
	}, [localCharE, activated]);

	return <></>;
}
