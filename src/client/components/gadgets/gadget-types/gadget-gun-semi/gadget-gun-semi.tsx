import { pair } from "@rbxts/jecs";
import React from "@rbxts/react";
import { useScheduleTick } from "client/hooks/use-schedule-tick";
import { GadgetTypeAs, world } from "shared/ecs";
import { GadgetTypeIdentifiers } from "shared/gadgets";

export function Gadget_Gun_Semi() {
	useScheduleTick(() => {
		for (const [e, _] of world.query(pair(GadgetTypeAs, GadgetTypeIdentifiers.gun_semi))) {
			print(e);
		}
	});
	return <></>;
}
