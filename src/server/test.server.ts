import { pair } from "@rbxts/jecs";
import { makeThrottle } from "shared/closures/make-throttle";
import { makeTrack, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";

const parentE = world.entity();
const ChildOf = world.component<number>();
const ChildOfParentE = pair(ChildOf, parentE);

const throttle = makeThrottle(1, 0);

const track = makeTrack(ChildOfParentE);

scheduleTick(() => {
	throttle(() => {
		print("hi");
		const e = world.entity();
		world.set(e, ChildOfParentE, 1);
	});

	track((changes) => {
		for (const [e] of changes.added()) {
			print("Added");
		}
		for (const [e] of changes.changed()) {
			print("Changed");
		}
		for (const [e] of changes.removed()) {
			print("Removed");
		}
	});
});
