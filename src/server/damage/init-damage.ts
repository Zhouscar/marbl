import { pair } from "@rbxts/jecs";
import { DamageAmount, DamageFrom, DamageTo, InitDamage } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, { fromE, toE, amount }] of world.query(InitDamage)) {
		if (fromE !== undefined) {
			world.add(e, pair(DamageFrom, fromE));
		}
		world.add(e, pair(DamageTo, toE));
		print(toE);
		world.set(e, DamageAmount, amount);

		world.remove(e, InitDamage);
	}
});
