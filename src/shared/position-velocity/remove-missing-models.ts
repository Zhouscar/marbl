import { Workspace } from "@rbxts/services";
import { makeListen } from "shared/closures/make-listen";
import { IS_CLIENT } from "shared/constants/core";
import { makeTrack, PV, ServerPV, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

const listen = makeListen();
const trackRenderable = makeTrack(PV);

scheduleTick(() => {
	for (const [e, pv] of world.query(PV)) {
		listen(pv, pv.AncestryChanged, () => {
			if (pv.IsDescendantOf(Workspace)) return;
			if (IS_CLIENT && world.has(e, ServerPV)) return;
			world.delete(e);
		});
	}

	trackRenderable((changes) => {
		for (const [e, prevPv] of changes.removed()) {
			prevPv?.Destroy();
		}
	});
});
