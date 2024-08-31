// clean up on casting removal is done here

import { makeTrack } from "shared/closures/make-track";
import {
	CasterCasting,
	CasterPrevPositions,
	CasterResultEntities,
	CasterResultInstances,
} from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

const trackCasting = makeTrack(CasterCasting);

scheduleTick(() => {
	trackCasting((changes) => {
		for (const [e] of changes.removed()) {
			world.remove(e, CasterResultEntities);
			world.remove(e, CasterResultInstances);
			world.remove(e, CasterPrevPositions);
		}
	});
});
