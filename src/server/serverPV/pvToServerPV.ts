import { CollectionService } from "@rbxts/services";
import { makeTrack } from "shared/closures/make-track";
import { PV, ServerPV } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

const trackPV = makeTrack(PV);

scheduleTick(() => {
	for (const [e, pv] of world.query(PV).without(ServerPV)) {
		world.add(e, ServerPV);
		CollectionService.AddTag(pv, "ServerPV");
	}

	trackPV((changes) => {
		for (const [e, _] of changes.removed()) {
			world.remove(e, ServerPV);
		}
	});
});
