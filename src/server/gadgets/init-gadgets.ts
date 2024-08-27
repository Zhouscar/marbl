import { pair } from "@rbxts/jecs";
import {
	GadgetNameAs,
	GadgetOf,
	GadgetRotationOffset,
	GadgetVariantAs,
	InitGadgets,
	NameOfGadget,
	Plr,
	PV,
	VariantOfGadget,
} from "shared/components";
import { IS_SERVER } from "shared/constants/core";
import { GadgetNameIdEs, Gadgets, GadgetVariantIdEs, getGadgetPV } from "shared/gadgets";
import { scheduleTick } from "shared/utils/per-frame";
import { pseudoAnchor } from "shared/utils/pv-utils";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, gadgets] of world.query(InitGadgets)) {
		const cf = world.get(e, PV)?.GetPivot();
		const player = world.get(e, Plr);

		gadgets.forEach((gadgetContext) => {
			const gadgetModel = getGadgetPV(gadgetContext.gadgetName);
			if (cf !== undefined) {
				gadgetModel.PivotTo(cf);
			}
			if (IS_SERVER) {
				pseudoAnchor(gadgetModel, true);
			}

			const gadgetE = world.entity();
			world.set(gadgetE, PV, gadgetModel);
			world.add(gadgetE, pair(GadgetOf, e));
			world.set(gadgetE, GadgetRotationOffset, gadgetContext.rotationOffset);
			if (player !== undefined) {
				gadgetModel
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))
					.forEach((part) => {
						part.SetNetworkOwner(player);
					});
			}

			world.set(gadgetE, NameOfGadget, gadgetContext.gadgetName);
			world.set(gadgetE, VariantOfGadget, Gadgets[gadgetContext.gadgetName]);

			const gadgetNameId = GadgetNameIdEs[gadgetContext.gadgetName];
			const gadgetTypeId = GadgetVariantIdEs[Gadgets[gadgetContext.gadgetName].type];

			world.add(gadgetE, pair(GadgetNameAs, gadgetNameId));
			world.add(gadgetE, pair(GadgetVariantAs, gadgetTypeId));
		});

		world.remove(e, InitGadgets);
	}
});
