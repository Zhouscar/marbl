import { makeTrack } from "shared/ecs";
import { Test } from "shared/ecs/components/test";
import { onTick } from "shared/utils/per-frame";

const trackTest = makeTrack(Test);

onTick(() => {
	// trackTest((changes) => {
	// 	for (const [e, test] of changes.added()) {
	// 		print(`Client`);
	// 	}
	// });
});
