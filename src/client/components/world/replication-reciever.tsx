import { Entity, pair } from "@rbxts/jecs";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useCallback } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useWorldState } from "client/hooks/use-world-state";
import { world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { ComponentDataContainer } from "shared/serdes";

export function ReplicationReciever() {
	const worldState = useWorldState();

	const getComponentFromContainer = useCallback(
		(container: ComponentDataContainer, componentStr: string) => {
			const eMap = worldState.eMap;
			if (container.pair !== undefined) {
				const first = container.pair.first;
				let second = container.pair.second;

				if (container.pair.secondIsEntity) {
					let _second = eMap.get(tostring(second));
					if (_second === undefined) {
						_second = world.entity();
						eMap.set(tostring(second), _second);
					}
					second = _second;
				}

				print(first, second);

				return pair(first, second);
			} else {
				return tonumber(componentStr) as Entity;
			}
		},
		[worldState],
	);

	useEventListener(remotes.world.replicate, (replicationMap, clientInitializedMap) => {
		const eMap = worldState.eMap;
		print(replicationMap);

		replicationMap.forEach((componentMap, serverEStr) => {
			if (clientInitializedMap.get(serverEStr) === Players.LocalPlayer) return;

			const e = eMap.get(serverEStr);

			if (e !== undefined && next(componentMap) === undefined) {
				world.delete(e);
				eMap.delete(serverEStr);
			}

			const componentsToInsert: Set<{ component: Entity } & ComponentDataContainer> =
				new Set();
			const componentsToRemove: Set<Entity> = new Set();

			componentMap.forEach((container, componentStr) => {
				if (container.data !== undefined || container.isTag) {
					componentsToInsert.add({
						component: getComponentFromContainer(container, componentStr),
						data: container.data,
						isTag: container.isTag === true,
					});
				} else {
					componentsToRemove.add(getComponentFromContainer(container, componentStr));
				}
			});

			if (e === undefined) {
				const newE = world.entity();

				componentsToInsert.forEach((context) => {
					if (context.isTag) {
						world.add(newE, context.component);
					} else {
						world.set(newE, context.component, context.data);
					}
				});

				eMap.set(serverEStr, newE);
			} else {
				if (!componentsToInsert.isEmpty()) {
					componentsToInsert.forEach((context) => {
						if (context.isTag) {
							world.add(e, context.component);
						} else {
							world.set(e, context.component, context.data);
						}
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
