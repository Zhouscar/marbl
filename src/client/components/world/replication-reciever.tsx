import { Entity, pair } from "@rbxts/jecs";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useCallback } from "@rbxts/react";
import { useWorldState } from "client/hooks/use-world-state";
import { AnotherHost, ServerE } from "shared/components";
import { remotes } from "shared/remotes";
import { ComponentDataContainer } from "shared/serdes";
import { world } from "shared/world";

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

				return pair(first, second);
			} else {
				return tonumber(componentStr) as Entity;
			}
		},
		[worldState],
	);

	useEventListener(remotes.world.replicate, (replicationMap) => {
		const eMap = worldState.eMap;
		// print(replicationMap);

		replicationMap.forEach((componentMap, serverEStr) => {
			const e = eMap.get(serverEStr);

			if (e !== undefined && !world.has(e, AnotherHost)) return;

			if (e !== undefined && next(componentMap) === undefined) {
				world.delete(e);
				eMap.delete(serverEStr);
			}

			const componentsToInsert: Set<{ component: Entity } & ComponentDataContainer> =
				new Set();
			const componentsToRemove: Set<Entity> = new Set();

			const serverE = tonumber(serverEStr) as Entity;

			if (e === undefined || world.get(e, ServerE) !== serverE) {
				componentsToInsert.add({
					component: ServerE,
					data: tonumber(serverEStr) as Entity,
				});
				componentsToInsert.add({
					component: AnotherHost,
					isTag: true,
				});
			}

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
