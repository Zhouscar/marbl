import React from "@rbxts/react";
import { WorldStarter } from "./world-starter";
import { ReplicationReciever } from "./replicationReciever";

export function World() {
	return (
		<>
			<WorldStarter />
			<ReplicationReciever />
		</>
	);
}
