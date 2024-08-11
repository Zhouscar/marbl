import { BroadcastAction } from "@rbxts/reflex";
import { Client as ServerToClient, Server as ClientToServer, namespace, remote, createRemotes } from "@rbxts/remo";
import { SharedState } from "./store";
import { ReplicationMap } from "./serdes";

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
	}),
});
