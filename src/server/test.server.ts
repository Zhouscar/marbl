import { makeThrottle } from "shared/closures/make-throttle";
import { makeTrack, Replicated, world } from "shared/ecs";
import { Test } from "shared/ecs/components/test";
import { onTick } from "shared/utils/per-frame";

world.add(Test, Replicated);

const trackTest = makeTrack(Test);
const throttle = makeThrottle(1);

const e = world.entity();
world.set(e, Test, 0);

let i = 0;

onTick(() => {
	throttle(() => {
		world.set(e, Test, i++);
	});

	trackTest((changes) => {
		for (const [e, test] of changes.added()) {
			print(`Entity Added`);
		}
		for (const [e, test] of changes.changed()) {
			print(`Entity Added`);
		}
	});
});
