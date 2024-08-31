// the raycast is done here
// updating previous positions is done here

import { Make } from "@rbxts/altmake";
import { Entity } from "@rbxts/jecs";
import { Debris, Workspace } from "@rbxts/services";
import Sift from "@rbxts/sift";
import {
	CasterAttachments,
	CasterCasting,
	CasterPrevPositions,
	CasterResultEntities,
	CasterResultInstances,
	PremadeRaycastParams,
} from "shared/components";
import { getEFromPart } from "shared/position-velocity/part-to-e";
import { schedulePhysics } from "shared/utils/per-frame";
import { world } from "shared/world";

function visualize(from: Vector3, to: Vector3) {
	const distance = from.sub(to).Magnitude;
	const p = Make("Part", {
		Anchored: true,
		CanCollide: false,
		Size: new Vector3(0.05, 0.05, distance),
		CFrame: CFrame.lookAt(from, to).mul(new CFrame(0, 0, -distance / 2)),

		Parent: Workspace,

		Material: Enum.Material.ForceField,
		Color: Color3.fromRGB(255, 0, 0),
	});

	Debris.AddItem(p, 1);
}

schedulePhysics(() => {
	for (const [e, attachments, prevPositions, params] of world.query(
		CasterAttachments,
		CasterPrevPositions,
		PremadeRaycastParams,
		CasterCasting,
	)) {
		const instances: Set<Instance> = new Set();
		const entities: Set<Entity> = new Set();

		attachments.forEach((attachment) => {
			const prevPosition = prevPositions.get(attachment);
			assert(prevPosition);
			const position = attachment.WorldPosition;

			visualize(prevPosition, position);

			const result = Workspace.Raycast(prevPosition, position.sub(prevPosition), params);
			if (result !== undefined) {
				instances.add(result.Instance);
			}
		});

		instances.forEach((instance) => {
			if (!instance.IsA("BasePart")) return;
			const entity = getEFromPart(instance);
			if (entity === undefined) return;
			entities.add(entity);
		});

		const prevInstances = world.get(e, CasterResultInstances);
		if (
			!instances.isEmpty() &&
			(prevInstances === undefined || !Sift.Dictionary.equals(prevInstances, instances))
		) {
			world.set(e, CasterResultInstances, instances);
		}

		const prevEntities = world.get(e, CasterResultEntities);
		if (
			!entities.isEmpty() &&
			(prevEntities === undefined || !Sift.Dictionary.equals(prevEntities, entities))
		) {
			world.set(e, CasterResultEntities, entities);
		}
	}

	for (const [e, attachments] of world.query(CasterAttachments, CasterCasting)) {
		const newPrevPositions: Map<Attachment, Vector3> = new Map();

		attachments.forEach((attachment) => {
			newPrevPositions.set(attachment, attachment.WorldPosition);
		});

		world.set(e, CasterPrevPositions, newPrevPositions);
	}
});
