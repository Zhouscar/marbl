import { entityWithClientE } from "server/players/playerEMaps";
import { InitProjectile, InitProjectileHit, world } from "shared/ecs";
import { remotes } from "shared/remotes";

remotes.players.shootProjectile.connect((player, clientE, projectileContext) => {
	projectileContext.player = player;

	const e = entityWithClientE(player, clientE);
	world.set(e, InitProjectile, projectileContext);
});

remotes.players.projectileHit.connect((player, clientE, hitContext) => {
	const e = entityWithClientE(player, clientE);
	world.set(e, InitProjectileHit, hitContext);
});
