import { InitGadgets, InitMarbl, PV, world } from "shared/ecs";
import { getMarblPV } from "shared/marbls";
import { scheduleTick } from "shared/utils/per-frame";

scheduleTick(() => {
	for (const [e, context] of world.query(InitMarbl)) {
		const part = getMarblPV();
		part.Color = context.color;
		part.Material = context.material;
		part.PivotTo(context.cf);

		world.set(e, PV, part);

		if (context.player !== undefined) {
			part.SetNetworkOwner(context.player);
		}

		if (context.gadgets !== undefined && !context.gadgets.isEmpty()) {
			world.set(e, InitGadgets, context.gadgets);
		}

		world.remove(e, InitMarbl);
	}
});
