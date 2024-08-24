import React from "@rbxts/react";
import { WorldStarter } from "./world-starter";
import { ReplicationReciever } from "./replication-reciever";
import { ServerPVToPV } from "./serverPVToPV";
import { RemoveEmptyServerEntities } from "./remove-empty-server-entities";

export function World() {
	return (
		<>
			<WorldStarter />
			<ReplicationReciever />
			<ServerPVToPV />
			<RemoveEmptyServerEntities />
		</>
	);
}
