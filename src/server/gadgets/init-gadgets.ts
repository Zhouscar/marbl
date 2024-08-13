import { pair } from "@rbxts/jecs";
import {
	GadgetNameAs,
	GadgetOf,
	GadgetRotationOffset,
	GadgetTypeAs,
	InitGadgets,
	Plr,
	PV,
	world,
} from "shared/ecs";
import { GadgetNameIdentifiers, Gadgets, GadgetTypeIdentifiers, getGadgetPV } from "shared/gadgets";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

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

			const gadgetNameId = GadgetNameIdentifiers[gadgetContext.gadgetName];
			const gadgetTypeId = GadgetTypeIdentifiers[Gadgets[gadgetContext.gadgetName].type];

			world.add(gadgetE, pair(GadgetNameAs, gadgetNameId));
			world.add(gadgetE, pair(GadgetTypeAs, gadgetTypeId));
		});

		world.remove(e, InitGadgets);
	}
});
