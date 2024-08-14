import { pair } from "@rbxts/jecs";
import React, { useEffect, useMemo } from "@rbxts/react";
import { config } from "@rbxts/ripple";
import { useMotion } from "client/hooks/ripple";
import { useComponent } from "client/hooks/use-component";
import { useLocalE } from "client/hooks/use-local-e";
import { useWorldState } from "client/hooks/use-world-state";
import { GadgetOf, GadgetRotationOffset, PV, world } from "shared/ecs";
import { Maybe } from "shared/utils/monads";
import { onTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

export function GadgetsPointAt() {
	const localE = useLocalE();
	const pv = useComponent(localE, PV);
	const part = useMemo(() => new Maybe(pv).bind(getPvPrimaryPart).get(), [pv]);

	const worldState = useWorldState();

	const [rotationSpring, rotationApi] = useMotion(CFrame.identity);

	useEffect(() => {
		if (part === undefined) return;

		const connection = onTick.Connect(() => {
			const cf = CFrame.lookAt(part.GetPivot().Position, worldState.pointAt);
			rotationApi.spring(cf.Rotation, config.spring.wobbly);

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
