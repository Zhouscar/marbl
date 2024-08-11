import { CollectionService } from "@rbxts/services";
import { makeTrack, PV, ServerPV, world } from "shared/ecs";
import { onTick, scheduleTick } from "shared/utils/per-frame";

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
