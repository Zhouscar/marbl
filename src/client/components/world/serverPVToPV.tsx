import { Entity } from "@rbxts/jecs";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { CollectionService } from "@rbxts/services";
import { useWorldState } from "client/hooks/use-world-state";
import { E_ATTRIBUTE } from "shared/constants/core";
import { PV, world } from "shared/ecs";

export function ServerPVToPV() {
	const worldState = useWorldState();

	useEventListener(CollectionService.GetInstanceAddedSignal("ServerPV"), (instance) => {
		if (!instance.IsA("PVInstance")) return;

		task.spawn(() => {
			let serverE = instance.GetAttribute("serverE") as Entity | undefined;
			if (serverE === undefined) {
				instance.GetAttributeChangedSignal("serverE").Wait();
				serverE = instance.GetAttribute("serverE") as Entity | undefined;
				assert(serverE);
			}

			let clientE = worldState.eMap.get(tostring(serverE));
			if (clientE === undefined) {
				task.wait();
				clientE = worldState.eMap.get(tostring(serverE));
				assert(clientE);
			}

			world.set(clientE, PV, instance);
		});
	});

	useEventListener(CollectionService.GetInstanceRemovedSignal("ServerPV"), (instance) => {
		if (!instance.IsA("PVInstance")) return;
		const e = instance.GetAttribute(E_ATTRIBUTE) as Entity;
		assert(e);

		world.remove(e, PV);
	});

	return <></>;
}
