import { pair } from "@rbxts/jecs";
import React, { useEffect } from "@rbxts/react";
import { useLocalE } from "client/hooks/use-local-e";
import { LAST_E } from "shared/constants/core";
import { GadgetOf, GadgetVariantAs, GunOfGadget, world } from "shared/ecs";
import { GadgetVariantIdEs } from "shared/gadgets";
import { onTick } from "shared/utils/per-frame";

export function Gadget_Gun_Semi() {
	const localE = useLocalE();

	useEffect(() => {
		if (localE === LAST_E) return;

		const connection = onTick.Connect(() => {
			for (const [e, context] of world.query(
				GunOfGadget,
				pair(GadgetVariantAs, GadgetVariantIdEs.gun_semi),
				pair(GadgetOf, localE),
			)) {
				print(context.shootPart);
			}
		});

		return () => {
			connection.Disconnect();
		};
	}, [localE]);
	return <></>;
}
