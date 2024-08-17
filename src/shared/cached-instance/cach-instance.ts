import { makeTrack } from "shared/closures/make-track";
import { CachedInstance } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";

const track = makeTrack(CachedInstance);

scheduleTick(() => {
	track((changes) => {
		for (const [e, _, prevCachedInstance] of changes.changed()) {
			prevCachedInstance.objectCache.ReturnPart(prevCachedInstance.instance);
		}

		for (const [e, prevCachedInstance] of changes.removed()) {
			if (prevCachedInstance === undefined) continue;
			const trail = prevCachedInstance.instance.FindFirstChildWhichIsA("Trail");
			if (trail) {
				trail.Enabled = false;
			}

			prevCachedInstance.objectCache.ReturnPart(prevCachedInstance.instance);
		}
	});
});
