import { InitProjectile, world } from "shared/ecs";
import { remotes } from "shared/remotes";

remotes.players.shootProjectile.connect((player, projectileContext) => {
	projectileContext.player = player;
	world.set(world.entity(), InitProjectile, projectileContext);
});
