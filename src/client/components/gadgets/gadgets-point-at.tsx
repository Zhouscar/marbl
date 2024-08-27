import { pair } from "@rbxts/jecs";
import React, { useEffect, useMemo } from "@rbxts/react";
import { config } from "@rbxts/ripple";
import { useMotion } from "client/hooks/ripple";
import { useComponent } from "client/hooks/use-component";
import { useLocalCharE } from "client/hooks/use-local-char-e";
import { useWorldState } from "client/hooks/use-world-state";
import {
	GadgetImplicitAngularYMotion,
	GadgetOf,
	GadgetRotationOffset,
	PV,
} from "shared/components";
import { Maybe } from "shared/utils/monads";
import { onTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";
import { world } from "shared/world";

export function GadgetsPointAt() {
	const localCharE = useLocalCharE();
	const pv = useComponent(localCharE, PV);
	const part = useMemo(() => new Maybe(pv).bind(getPvPrimaryPart).get(), [pv]);

	const worldState = useWorldState();

	const [rotationSpring, rotationApi] = useMotion(CFrame.identity);

	useEffect(() => {
		if (part === undefined) return;

		const disconnect = onTick(() => {
			const cf = CFrame.lookAt(part.GetPivot().Position, worldState.pointAt);
			rotationApi.spring(cf.Rotation, config.spring.wobbly);

			for (const [e, gadgetPV, offset] of world.query(
				PV,
				GadgetRotationOffset,
				pair(GadgetOf, localCharE),
			)) {
				const angularYMotionValue =
					world.get(e, GadgetImplicitAngularYMotion)?.api.get() ?? 0;
				gadgetPV.PivotTo(
					new CFrame(cf.Position)
						.mul(rotationSpring.getValue())
						.mul(offset)
						.mul(CFrame.fromEulerAnglesYXZ(0, angularYMotionValue, 0)),
				);
			}
		});

		return disconnect;
	}, [part]);

	return <></>;
}
