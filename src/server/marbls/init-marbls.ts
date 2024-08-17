import { Health, InitGadgets, InitMarbl, PV } from "shared/components";
import { getMarblPV } from "shared/marbls";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, { material, color, player, health, cf, gadgets }] of world.query(InitMarbl)) {
		const part = getMarblPV();
		part.Color = color;
		part.Material = material;
		part.PivotTo(cf);

		world.set(e, PV, part);
		world.set(e, Health, health);

		if (player !== undefined) {
			part.SetNetworkOwner(player);
		}

		if (gadgets !== undefined && !gadgets.isEmpty()) {
			world.set(e, InitGadgets, gadgets);
		}

		world.remove(e, InitMarbl);
	}
});
