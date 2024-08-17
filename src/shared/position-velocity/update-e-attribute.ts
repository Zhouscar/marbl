import { makeTrack } from "shared/closures/make-track";
import { PV } from "shared/components";
import { E_ATTRIBUTE } from "shared/constants/core";
import { scheduleTick } from "shared/utils/per-frame";

const trackPV = makeTrack(PV);

scheduleTick(() => {
	trackPV((changes) => {
		for (const [e, pv] of changes.added()) {
			pv.SetAttribute(E_ATTRIBUTE, e);
		}

		for (const [e, pv] of changes.changed()) {
			pv.SetAttribute(E_ATTRIBUTE, e);
		}
	});
});

// const e = world.entity();

// const pv1 = Make("Part", {
// 	Parent: Workspace,
// 	Name: "TestUpdateEAttributePart1",
// 	Anchored: true,
// });
// const pv2 = Make("Part", {
// 	Parent: Workspace,
// 	Name: "TestUpdateEAttributePart2",
// 	Anchored: true,
// });

// task.wait(5);

// print("PV1");
// world.set(e, PV, pv1);

// task.wait(2);

// print("PV2");
// world.set(e, PV, pv2);

// task.wait(2);

// world.remove(e, PV);
