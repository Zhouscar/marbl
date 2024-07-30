import { E_ATTRIBUTE } from "shared/constants/core";
import { makeTrack, Renderable } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

const trackRenderable = makeTrack(Renderable);

scheduleTick(() => {
	trackRenderable((changes) => {
		for (const [e, pv] of changes.added()) {
			pv.SetAttribute(E_ATTRIBUTE, e);
		}

		for (const [e, pv] of changes.changed()) {
			pv.SetAttribute(E_ATTRIBUTE, e);
		}
	});
});
