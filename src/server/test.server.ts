import { makeThrottle } from "shared/closures/make-throttle";
import { makeTrack, world } from "shared/ecs";
import { onTick } from "shared/utils/per-frame";

const Test = world.component<number>();

const trackTest = makeTrack(Test);
const throttle = makeThrottle(1);

const e = world.entity();
let i = 0;

onTick(() => {
	throttle(() => {
		world.set(e, Test, i++);
	});

	trackTest((changes) => {
		for (const [e, test] of changes.changed()) {
			print(test);
		}
	});
});
