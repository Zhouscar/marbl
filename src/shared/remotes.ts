import { BroadcastAction } from "@rbxts/reflex";
import {
	Client as ServerToClient,
	Server as ClientToServer,
	namespace,
	remote,
	createRemotes,
} from "@rbxts/remo";
import { SharedState } from "./store";
import { ClientInitializedMap, ReplicationMap } from "./serdes";
import { EntityType } from "@rbxts/jecs";
import { InitProjectile, Positioner } from "./ecs";

export const remotes = createRemotes({
	store: namespace({
		dispatch: remote<ServerToClient, [actions: BroadcastAction[]]>(),
		hydrate: remote<ServerToClient, [state: Partial<SharedState>]>(),
		start: remote<ClientToServer>(),
	}),

	world: namespace({
		replicate: remote<
			ServerToClient,
			[replicationMap: ReplicationMap, clientInitializedMap: ClientInitializedMap]
		>(),
		start: remote<ClientToServer>(),
	}),

	players: namespace({
		spawn: remote<ClientToServer>(),
		shootProjectile: remote<
			ClientToServer,
			[projectileContext: EntityType<typeof InitProjectile>]
		>(),
	}),
});
