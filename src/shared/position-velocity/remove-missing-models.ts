import { RunService, Workspace } from "@rbxts/services";
import { makeListen } from "shared/closures/make-listen";
import { makeTrack, PV, ServerPV, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

const listen = makeListen();
const trackRenderable = makeTrack(PV);

scheduleTick(() => {
	for (const [e, pv] of world.query(PV)) {
		listen(pv, pv.AncestryChanged, () => {
			if (pv.IsDescendantOf(Workspace)) return;
			if (RunService.IsClient() && world.has(e, ServerPV)) return;
			world.clear(e);
		});
	}

	trackRenderable((changes) => {
		for (const [e, prevPv] of changes.removed()) {
			prevPv.Destroy();
		}
	});
});
