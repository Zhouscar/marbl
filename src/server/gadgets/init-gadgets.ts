import { pair } from "@rbxts/jecs";
import {
	GadgetNameAs,
	GadgetOf,
	GadgetRotationOffset,
	GadgetVariantAs,
	InitGadgets,
	Plr,
	PV,
} from "shared/components";
import { GadgetNameIdEs, Gadgets, GadgetVariantIdEs, getGadgetPV } from "shared/gadgets";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";
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

			const gadgetE = world.entity();
			world.set(gadgetE, PV, gadgetModel);
			world.add(gadgetE, pair(GadgetOf, e));
			world.set(gadgetE, GadgetRotationOffset, gadgetContext.rotationOffset);
			if (player !== undefined) {
				getPvPrimaryPart(gadgetModel)?.SetNetworkOwner(player);
			}

			const gadgetNameId = GadgetNameIdEs[gadgetContext.gadgetName];
			const gadgetTypeId = GadgetVariantIdEs[Gadgets[gadgetContext.gadgetName].type];

			world.add(gadgetE, pair(GadgetNameAs, gadgetNameId));
			world.add(gadgetE, pair(GadgetVariantAs, gadgetTypeId));
		});

		world.remove(e, InitGadgets);
	}
});
