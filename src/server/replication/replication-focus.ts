import { Plr, PV } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, pv, player] of world.query(PV, Plr)) {
		const part = getPvPrimaryPart(pv);
		player.ReplicationFocus = part;
	}
});
