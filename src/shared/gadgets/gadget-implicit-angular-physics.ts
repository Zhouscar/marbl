import { makeTrack } from "shared/closures/make-track";
import { GadgetImplicitAngularYMotion, VariantOfGadget } from "shared/components";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

const track = makeTrack(GadgetImplicitAngularYMotion);

onTick((dt) => {
	for (const [_, { goal, api }, variant] of world.query(
		GadgetImplicitAngularYMotion,
		VariantOfGadget,
	)) {
		api.spring(goal, { frequency: variant.type === "melee_spin" ? variant.accelFrequency : 3 });
		api.step(dt);
	}

	track((changes) => {
		for (const [_, context] of changes.removed()) {
			context?.api?.destroy();
		}
	});
});
