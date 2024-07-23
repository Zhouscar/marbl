import React from "@rbxts/react";
import { WorldStarter } from "./world-starter";
import { ReplicationReciever } from "./replication-reciever";

export function World() {
	return (
		<>
			<WorldStarter />
			<ReplicationReciever />
		</>
	);
}
