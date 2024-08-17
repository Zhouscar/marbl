import { Entity } from "@rbxts/jecs";
import { CollectionService } from "@rbxts/services";
import { PV, Tagged } from "shared/components";
import { E_ATTRIBUTE } from "shared/constants/core";
import { world } from "shared/world";

function spawnBound(instance: PVInstance, component: Entity) {
	const e = world.entity();
	world.set(e, PV, instance);

	instance.SetAttribute(E_ATTRIBUTE, e);
}

for (const [component, tagName] of world.query(Tagged)) {
	CollectionService.GetTagged(tagName)
		.filter((instance): instance is PVInstance => instance.IsA("PVInstance"))
		.forEach((instance) => {
			spawnBound(instance, component);
		});

	CollectionService.GetInstanceAddedSignal(tagName).Connect((instance) => {
		if (!instance.IsA("PVInstance")) return;
		spawnBound(instance, component);
	});

	CollectionService.GetInstanceRemovedSignal(tagName).Connect((instance) => {
		const e = instance.GetAttribute(E_ATTRIBUTE) as Entity | undefined;
		if (e !== undefined) {
			world.delete(e);
		}
	});
}
