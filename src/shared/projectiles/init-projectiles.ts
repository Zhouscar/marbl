import { Make } from "@rbxts/altmake";
import { pair } from "@rbxts/jecs";
import ObjectCache from "@rbxts/object-cache";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import {
	AnotherHost,
	CachedInstance,
	InitProjectile,
	IsProjectile,
	Positioner,
	PremadeRaycastParams,
	ProjectileByCreator,
	ProjectileByGadget,
	ProjectileDamageWhenHit,
	ProjectileEndTime,
} from "shared/components";
import { IS_CLIENT, IS_SERVER } from "shared/constants/core";
import { remotes } from "shared/remotes";
import { waitForPath } from "shared/utils/indexing-utils";
import { scheduleTick } from "shared/utils/per-frame";
import { getPlrE } from "shared/utils/player-utils";
import { getServerEFromClient } from "shared/utils/server-entity";
import { world } from "shared/world";

const projectileAsset = waitForPath(
	ReplicatedStorage,
	"assets/models/projectile",
	"Part",
) as Part & {
	trail: Trail;
};

projectileAsset.trail.Enabled = false;
projectileAsset.Anchored = true;

const projectileCache = new ObjectCache(
	projectileAsset,
	1000,
	Make("Folder", {
		Name: "projectileCache",
		Parent: Workspace,
	}),
);

scheduleTick(() => {
	if (IS_CLIENT) {
		for (const [e, { initialPosition, initialVelocity }] of world
			.query(Positioner, IsProjectile)
			.without(CachedInstance)) {
			const instance = projectileCache.GetPart(
				CFrame.lookAlong(initialPosition, initialVelocity),
			);
			instance.trail.Enabled = true;

			world.set(e, CachedInstance, {
				instance,
				objectCache: projectileCache,
			});
		}
	}

	for (const [e, context] of world.query(InitProjectile)) {
		world.add(e, IsProjectile);

		if (context.player !== undefined) {
			context.creatorE = getPlrE(context.player);
		}

		const raycastParams = new RaycastParams();
		raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		raycastParams.IgnoreWater = true;
		raycastParams.RespectCanCollide = true;

		if (IS_CLIENT) {
			const instance = projectileCache.GetPart(
				CFrame.lookAlong(context.position, context.velocity),
			);
			instance.trail.Enabled = true;

			raycastParams.AddToFilter(instance);

			world.set(e, CachedInstance, {
				instance,
				objectCache: projectileCache,
			});
		}

		world.set(e, PremadeRaycastParams, raycastParams);

		if (context.creatorE !== undefined) {
			world.add(e, pair(ProjectileByCreator, context.creatorE));
		}

		if (context.creatorGadgetE !== undefined) {
			world.add(e, pair(ProjectileByGadget, context.creatorGadgetE));
		}

		if (context.damage !== undefined) {
			world.set(e, ProjectileDamageWhenHit, { amount: 10 });
		}

		world.set(e, ProjectileEndTime, context.startTime + context.duration);
		world.set(e, Positioner, {
			startTime: context.startTime,
			initialPosition: context.position,
			initialVelocity: context.velocity,
			acceleration: context.acceleration,
		});

		if (IS_SERVER && context.player !== undefined) {
			world.add(e, AnotherHost);
		}

		if (IS_CLIENT && context.player === Players.LocalPlayer) {
			remotes.players.shootProjectile(e, {
				creatorE: getServerEFromClient(context.creatorE),
				creatorGadgetE: getServerEFromClient(context.creatorGadgetE),
				...context,
			});
		}
		// TODO: pv, positioner effect, projectile type
		// maybe also an IsProjectile component?
		world.remove(e, InitProjectile);
	}
});
