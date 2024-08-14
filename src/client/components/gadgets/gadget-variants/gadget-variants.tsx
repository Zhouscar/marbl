import React from "@rbxts/react";
import { Gadget_Gun_Auto } from "./gadget-gun-auto";
import { Gadget_Gun_Semi } from "./gadget-gun-semi";
import { Gadget_Melee_Spin } from "./gadget-melee-spin";
import { Gadget_Melee_Stab } from "./gadget-melee-stab";

export function GadgetVariants() {
	return (
		<>
			<Gadget_Gun_Auto />
			<Gadget_Gun_Semi />
			<Gadget_Melee_Spin />
			<Gadget_Melee_Stab />
		</>
	);
}
