import { pair } from "@rbxts/jecs";
import { GadgetOf, GadgetRotationOffset, InitMarbl, Plr, PV, world } from "shared/ecs";
import { getGadget } from "shared/gadgets";
import { getMarbl } from "shared/marbls";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

scheduleTick(() => {
	for (const [e, context] of world.query(InitMarbl)) {
		const part = getMarbl();
		part.Color = context.color;
		part.Material = context.material;
		part.PivotTo(context.cf);

		world.set(e, PV, part);
		if (context.player !== undefined) {
			world.set(e, Plr, context.player);
			part.SetNetworkOwner(context.player);
		}

		context.gadgets.forEach((gadgetContext) => {
			const gadgetModel = getGadget(gadgetContext.gadgetType);
			gadgetModel.PivotTo(context.cf);

			const gadgetE = world.entity();
			world.set(gadgetE, PV, gadgetModel);
			world.add(gadgetE, pair(GadgetOf, e));
			world.set(gadgetE, GadgetRotationOffset, gadgetContext.rotationOffset);
			if (context.player !== undefined) {
				getPvPrimaryPart(gadgetModel)?.SetNetworkOwner(context.player);
			}
		});

		world.remove(e, InitMarbl);
	}
});
