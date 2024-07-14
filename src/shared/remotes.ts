import { BroadcastAction } from "@rbxts/reflex";
import { Client as ServerToClient, Server as ClientToServer, namespace, remote, createRemotes } from "@rbxts/remo";
import { SharedState } from "./store";

export const remotes = createRemotes({
	store: namespace({
		dispatch: remote<ServerToClient, [actions: BroadcastAction[]]>(),
		hydrate: remote<ServerToClient, [state: Partial<SharedState>]>(),
		start: remote<ClientToServer>(),
	}),
});
