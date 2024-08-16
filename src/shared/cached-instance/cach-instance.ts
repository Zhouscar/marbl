import { CachedInstance, makeTrack } from "shared/ecs";
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
				print("hi");
				trail.Enabled = false;
			}

			prevCachedInstance.objectCache.ReturnPart(prevCachedInstance.instance);
		}
	});
});
