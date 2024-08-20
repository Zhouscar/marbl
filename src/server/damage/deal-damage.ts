import { pair, Wildcard } from "@rbxts/jecs";
import { DamageAmount, DamageTo, Health, PV } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [contextE, amount] of world.query(DamageAmount, pair(DamageTo, Wildcard))) {
		const toE = world.target(contextE, DamageTo)!;
		const health = world.get(toE, Health);

		if (health !== undefined) {
			world.set(toE, Health, math.max(health - amount, 0));
		}

		world.delete(contextE);
		// conditional style for future possibility of healthless entities
		// TODO: DamageRecord entity for the client to know what happened
	}
});
