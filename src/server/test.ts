// import { pair } from "@rbxts/jecs";
// import { makeThrottle } from "shared/closures/make-throttle";
// import { makeTrackPairWildCard } from "shared/closures/make-track-pair-wildcard";
// import { world } from "shared/ecs";
// import { AttackedBy, Attacker } from "shared/ecs/components";
// import { scheduleTick } from "shared/utils/per-frame";

// const attacker1 = world.entity();
// world.set(attacker1, Attacker, true);

// const attacker2 = world.entity();
// world.set(attacker2, Attacker, true);

// const attacked = world.entity();

// const throttle1 = makeThrottle(2, 0);
// const throttle2 = makeThrottle(2, 1);

// const track = makeTrackPairWildCard(AttackedBy);

// scheduleTick(() => {
// 	throttle1(() => {
// 		print(attacker1);
// 		world.set(attacked, pair(AttackedBy, attacker1), true);
// 		world.remove(attacked, pair(AttackedBy, attacker2));
// 	});

// 	throttle2(() => {
// 		print(attacker2);
// 		world.set(attacked, pair(AttackedBy, attacker2), true);
// 		world.remove(attacked, pair(AttackedBy, attacker1));
// 	});

// 	track((changes) => {
// 		for (const [e, target] of changes.added()) {
// 			print("Added AttackedBy " + target);
// 		}
// 		for (const [e, target] of changes.removed()) {
// 			print("Removed AttackedBy " + target);
// 		}
// 	});
// });
