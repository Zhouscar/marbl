import { Entity } from "@rbxts/jecs";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useWorldState } from "client/hooks/use-world-state";
import { world } from "shared/ecs";
import { remotes } from "shared/remotes";

export function ReplicationReciever() {
	const worldState = useWorldState();

	useEventListener(remotes.world.replicate, (replicationMap) => {
		const eMap = worldState.eMap;

		replicationMap.forEach((componentMap, serverEStr) => {
			const e = eMap.get(serverEStr);

			if (e !== undefined && next(componentMap) === undefined) {
				world.delete(e);
				eMap.delete(serverEStr);
			}

			const componentsToInsert: Set<{ component: Entity; data: unknown }> = new Set();
			const componentsToRemove: Set<Entity> = new Set();

			componentMap.forEach((container, componentStr) => {
				if (container.data !== undefined) {
					componentsToInsert.add({ component: tonumber(componentStr) as Entity, data: container.data });
				} else {
					componentsToRemove.add(tonumber(componentStr) as Entity);
				}
			});

			if (e === undefined) {
				const newE = world.entity();

				componentsToInsert.forEach((context) => {
					world.set(newE, context.component, context.data);
				});

				eMap.set(serverEStr, newE);
			} else {
				if (!componentsToInsert.isEmpty()) {
					componentsToInsert.forEach((context) => {
						world.set(e, context.component, context.data);
					});
				}
				if (!componentsToRemove.isEmpty()) {
					componentsToRemove.forEach((component) => {
						world.remove(e, component);
					});
				}
			}
		});
	});

	return <></>;
}
