import { entityWithClientE } from "server/players/playerEMaps";
import { InitProjectile, InitProjectileHit } from "shared/components";
import { remotes } from "shared/remotes";
import { world } from "shared/world";

remotes.players.shootProjectile.connect((player, clientE, projectileContext) => {
	projectileContext.player = player;

	const e = entityWithClientE(player, clientE);
	world.set(e, InitProjectile, projectileContext);
});

remotes.players.projectileHit.connect((player, clientE, hitContext) => {
	const e = entityWithClientE(player, clientE);
	world.set(e, InitProjectileHit, hitContext);
});
