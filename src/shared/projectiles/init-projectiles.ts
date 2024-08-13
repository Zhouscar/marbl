import { pair } from "@rbxts/jecs";
import { Players, RunService } from "@rbxts/services";
import { ClientInitializedBy, InitProjectile, Positioner, ProjectileBy, world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { scheduleTick } from "shared/utils/per-frame";
import { getPlayerE } from "shared/utils/player-utils";

scheduleTick(() => {
	for (const [e, context] of world.query(InitProjectile)) {
		if (RunService.IsClient() && context.player === Players.LocalPlayer) {
			remotes.players.shootProjectile(context);
		}

		if (context.player !== undefined) {
			context.creator = getPlayerE(context.player);
		}

		if (RunService.IsServer() && context.player !== undefined) {
			world.set(e, ClientInitializedBy, context.player);
		}

		if (context.creator !== undefined) {
			world.add(e, pair(ProjectileBy, context.creator));
		}

		world.set(e, Positioner, {
			startTime: context.startTime,
			initialPosition: context.position,
			initialVelocity: context.velocity,
			acceleration: context.acceleration,
		});
		// TODO: pv, positioner effect, projectile type
		// maybe also an IsProjectile component?
		world.remove(e, InitProjectile);
	}
});
