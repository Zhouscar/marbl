import { pair } from "@rbxts/jecs";
import {
	AnotherHost,
	CachedInstance,
	InitDamage,
	InitProjectileHit,
	Positioner,
	ProjectileDamageWhenHit,
	ProjectileEndTime,
	ProjectileHitCF,
} from "shared/components";
import { IS_CLIENT, IS_SERVER } from "shared/constants/core";
import { remotes } from "shared/remotes";
import { scheduleTick } from "shared/utils/per-frame";
import { getServerEFromClient } from "shared/utils/server-entity";
import { gameTime } from "shared/utils/time-utils";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, context] of world.query(InitProjectileHit)) {
		world.remove(e, Positioner);
		world.remove(e, CachedInstance);
		world.set(e, ProjectileEndTime, gameTime() + 1);

		if (IS_CLIENT && !world.has(e, AnotherHost)) {
			remotes.players.projectileHit.fire(e, {
				hitByE: getServerEFromClient(context.hitByE),
				...context,
			});
		}

		const damageConfig = world.get(e, ProjectileDamageWhenHit);

		if (IS_SERVER && context.hitByE !== undefined && damageConfig !== undefined) {
			world.set(world.entity(), InitDamage, {
				...damageConfig,
				fromE: e,
				toE: context.hitByE,
				// time: gameTime(),
			});
		}

		world.set(e, ProjectileHitCF, CFrame.lookAlong(context.position, context.direction));

		world.remove(e, InitProjectileHit);
	}
});
