import { Make } from "@rbxts/altmake";
import { pair } from "@rbxts/jecs";
import ObjectCache from "@rbxts/object-cache";
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import {
	CachedInstance,
	ClientInitializedBy,
	InitProjectile,
	Positioner,
	ProjectileByCreator,
	ProjectileByGadget,
	world,
} from "shared/ecs";
import { remotes } from "shared/remotes";
import { waitForPath } from "shared/utils/indexing-utils";
import { scheduleTick } from "shared/utils/per-frame";
import { getPlayerE } from "shared/utils/player-utils";

const projectileAsset = waitForPath(
	ReplicatedStorage,
	"assets/models/projectile",
	"Part",
) as Part & {
	trail: Trail;
};

projectileAsset.trail.Enabled = false;

const projectileCache = new ObjectCache(
	projectileAsset,
	1000,
	Make("Folder", {
		Name: "projectileCache",
		Parent: Workspace,
	}),
);

scheduleTick(() => {
	for (const [e, context] of world.query(InitProjectile)) {
		if (RunService.IsClient() && context.player === Players.LocalPlayer) {
			remotes.players.shootProjectile(context);
		}

		if (context.player !== undefined) {
			context.creatorE = getPlayerE(context.player);
		}

		if (RunService.IsServer() && context.player !== undefined) {
			world.set(e, ClientInitializedBy, context.player);
		}

		if (RunService.IsClient()) {
			const instance = projectileCache.GetPart(
				CFrame.lookAlong(context.position, context.velocity),
			);
			instance.trail.Enabled = true;
			world.set(e, CachedInstance, {
				instance,
				objectCache: projectileCache,
			});
		}

		if (context.creatorE !== undefined) {
			world.add(e, pair(ProjectileByCreator, context.creatorE));
		}

		if (context.creatorGadgetE !== undefined) {
			world.add(e, pair(ProjectileByGadget, context.creatorGadgetE));
		}

		world.set(e, Positioner, {
			startTime: context.startTime,
			initialPosition: context.position,
			initialVelocity: context.velocity,
			acceleration: context.acceleration,
		});
		// TODO: pv, positioner effect, projectile type
		// maybe also an IsProjectile component?
		print("hi");
		world.remove(e, InitProjectile);
	}
});
