import { InitGadgets, InitMarbl, PV } from "shared/components";
import { getMarblPV } from "shared/marbls";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

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
