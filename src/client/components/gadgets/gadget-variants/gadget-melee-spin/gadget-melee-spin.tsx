import { pair } from "@rbxts/jecs";
import React, { useEffect } from "@rbxts/react";
import { createMotion } from "@rbxts/ripple";
import { useConstant } from "client/hooks/use-constant";
import { useLocalCharE } from "client/hooks/use-local-char-e";
import { useStated } from "client/hooks/use-stated";
import { useWorldState } from "client/hooks/use-world-state";
import { makeTrack } from "shared/closures/make-track";
import {
	CasterAttachments,
	CasterCasting,
	CasterResultEntities,
	CasterResultInstances,
	GadgetImplicitAngularYMotion,
	GadgetMeleeSpinRotationTimes,
	GadgetOf,
	GadgetVariantAs,
	MeleeOfGadget,
	PremadeRaycastParams,
	PV,
	VariantOfGadget,
} from "shared/components";
import { LAST_E } from "shared/constants/core";
import { GadgetVariantIdEs } from "shared/gadgets";
import { onTick, scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

function closestMultiple(a: number, b: number): number {
	const k = math.floor(a / b);
	return k * b;
}

export function Gadget_Melee_Spin() {
	const localCharE = useLocalCharE();
	const worldState = useWorldState();

	const activated = useStated(worldState, "activated");

	const trackResult = useConstant(makeTrack(CasterResultEntities));
	// TODO: make the result work

	scheduleTick(() => {
		trackResult((changes) => {
			for (const [e, es] of changes.added()) {
				print("added");
			}

			for (const [e, es] of changes.changed()) {
				print("changed");
			}
			// TODO: actual damage done here

			for (const [e, es] of changes.removed()) {
				print("removed");
			}
		});
	});

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

		for (const [e, { casterAttachments }] of world.query(
			MeleeOfGadget,
			pair(GadgetVariantAs, GadgetVariantIdEs.melee_spin),
			pair(GadgetOf, localCharE),
		)) {
			const params = new RaycastParams();
			params.IgnoreWater = true;
			params.FilterType = Enum.RaycastFilterType.Exclude;
			params.RespectCanCollide = false;

			const charPV = world.get(localCharE, PV);
			if (charPV) {
				params.AddToFilter(charPV);
			}

			for (const [e, pv] of world.query(PV, pair(GadgetOf, localCharE))) {
				params.AddToFilter(pv);
			}

			world.set(e, CasterAttachments, casterAttachments);
			world.set(e, PremadeRaycastParams, params);
		}

		for (const [e, _] of world.query(
			MeleeOfGadget,
			pair(GadgetVariantAs, GadgetVariantIdEs.melee_spin),
			pair(GadgetOf, localCharE),
		)) {
			if (activated) {
				world.add(e, CasterCasting);
			} else {
				world.remove(e, CasterCasting);
			}
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

					const rotationTimes = world.get(e, GadgetMeleeSpinRotationTimes);
					if (rotationTimes === undefined || goal > (rotationTimes + 1) * math.pi * 2) {
						world.set(
							e,
							GadgetMeleeSpinRotationTimes,
							math.floor(goal / (math.pi * 2)),
						);
						world.remove(e, CasterResultInstances);
						world.remove(e, CasterResultEntities);
					}

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
