import { BroadcastAction } from "@rbxts/reflex";
import {
	Client as ServerToClient,
	Server as ClientToServer,
	namespace,
	remote,
	createRemotes,
} from "@rbxts/remo";
import { SharedState } from "./store";
import { ReplicationMap } from "./serdes";
import { Entity, EntityType } from "@rbxts/jecs";
import { InitProjectile, InitProjectileHit } from "./components";

export const remotes = createRemotes({
	store: namespace({
		dispatch: remote<ServerToClient, [actions: BroadcastAction[]]>(),
		hydrate: remote<ServerToClient, [state: Partial<SharedState>]>(),
		start: remote<ClientToServer>(),
	}),

	world: namespace({
		replicate: remote<ServerToClient, [replicationMap: ReplicationMap]>(),
		start: remote<ClientToServer>(),
	}),

	players: namespace({
		spawn: remote<ClientToServer>(),
		shootProjectile: remote<
			ClientToServer,
			[clientE: Entity, projectileContext: EntityType<typeof InitProjectile>]
			// TODO: server needs to know which one the client is because the entity is created in the client therefore I cannot let client convert it to server but instead server convert into client, and it is better to be done with pairs for the optimization
		>(),
		projectileHit: remote<
			ClientToServer,
			[clientE: Entity, hitContext: EntityType<typeof InitProjectileHit>]
		>(),
	}),
});
