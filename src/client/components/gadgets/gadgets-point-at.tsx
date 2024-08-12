import { pair } from "@rbxts/jecs";
import React, { useEffect, useMemo } from "@rbxts/react";
import { useMotion } from "client/hooks/ripple";
import { useComponent } from "client/hooks/use-component";
import { useLocalE } from "client/hooks/use-local-e";
import { useWorldState } from "client/hooks/use-world-state";
import { GadgetOf, GadgetRotationOffset, PV, world } from "shared/ecs";
import { Maybe } from "shared/utils/monads";
import { onPhysics } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

export function GadgetsPointAt() {
	const localE = useLocalE();
	const pv = useComponent(localE, PV);
	const part = useMemo(() => new Maybe(pv).bind(getPvPrimaryPart).get(), [pv]);

	const worldState = useWorldState();

	const [rotationSpring, rotationApi] = useMotion(CFrame.identity);

	useEffect(() => {
		if (part === undefined) return;

		const connection = onPhysics.Connect(() => {
			const cf = CFrame.lookAt(part.GetPivot().Position, worldState.pointAt);
			rotationApi.spring(cf.Rotation, { damping: 0.6, frequency: 0.5 });

			for (const [e, gadgetPV, offset] of world.query(
				PV,
				GadgetRotationOffset,
				pair(GadgetOf, localE),
			)) {
				const gadgetPart = getPvPrimaryPart(gadgetPV);
				if (gadgetPart) {
					gadgetPart.Anchored = true;
				}
				gadgetPV.PivotTo(
					new CFrame(cf.Position).mul(rotationSpring.getValue()).mul(offset),
				);
			}
		});

		return () => {
			connection.Disconnect();
		};
	}, [part]);

	return <></>;
}
