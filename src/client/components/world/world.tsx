import React from "@rbxts/react";
import { WorldStarter } from "./world-starter";
import { ReplicationReciever } from "./replication-reciever";
import { ServerPVToPV } from "./serverPVToPV";

export function World() {
	return (
		<>
			<WorldStarter />
			<ReplicationReciever />
			<ServerPVToPV />
		</>
	);
}
