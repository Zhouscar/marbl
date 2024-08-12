import { ChangeCF, PV, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

scheduleTick(() => {
	for (const [e, pv, cf] of world.query(PV, ChangeCF)) {
		pv.PivotTo(cf);
		world.remove(e, ChangeCF);
	}
});
