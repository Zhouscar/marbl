import { remotes } from "shared/remotes";
import { getMarbl } from "./marbl";
import { Marbl, Plr, PV, world } from "shared/ecs";

remotes.players.spawn.connect((player) => {
	const e = world.entity();
	const marbl = getMarbl();
	marbl.SetNetworkOwner(player);
	// TODO: should probably consider about simulation distance as well

	world.set(e, PV, marbl);
	world.add(e, Marbl);
	world.set(e, Plr, player);
});
