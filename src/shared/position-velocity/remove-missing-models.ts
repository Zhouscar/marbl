import { Workspace } from "@rbxts/services";
import { makeListen } from "shared/closures/make-listen";
import { makeTrack, Renderable, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

const listen = makeListen();
const trackRenderable = makeTrack(Renderable);

scheduleTick(() => {
	for (const [e, pv] of world.query(Renderable)) {
		listen(pv, pv.AncestryChanged, () => {
			if (pv.IsDescendantOf(Workspace)) return;
			world.clear(e);
		});
	}

	trackRenderable((changes) => {
		for (const [e, prevPv] of changes.removed()) {
			prevPv.Destroy();
		}
	});
});
