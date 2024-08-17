import { ChangeCF, PV } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, pv, cf] of world.query(PV, ChangeCF)) {
		pv.PivotTo(cf);
		world.remove(e, ChangeCF);
	}
});
