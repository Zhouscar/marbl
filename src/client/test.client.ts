import { pair, Wildcard } from "@rbxts/jecs";
import { makeTrackPairWildCard } from "shared/closures/make-track-pair-wildcard";
import { AttackedBy } from "shared/ecs/components";
import { scheduleTick } from "shared/utils/per-frame";

const track = makeTrackPairWildCard(AttackedBy);

scheduleTick(() => {
	track((changes) => {
		for (const [e, target] of changes.added()) {
			print("Added AttackedBy " + target);
		}
		for (const [e, target] of changes.removed()) {
			print("Removed AttackedBy " + target);
		}
	});
});
