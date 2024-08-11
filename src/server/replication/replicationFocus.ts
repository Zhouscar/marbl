import { Plr, PV, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

scheduleTick(() => {
	for (const [e, pv, player] of world.query(PV, Plr)) {
		const part = getPvPrimaryPart(pv);
		player.ReplicationFocus = part;
	}
});
