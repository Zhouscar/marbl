import { Entity } from "@rbxts/jecs";
import { Workspace } from "@rbxts/services";
import { makeTrack } from "shared/closures/make-track";
import { PV } from "shared/components";
import { onTick } from "shared/utils/per-frame";

const partEs: Map<BasePart, Entity> = new Map();

export function getEFromPart(part: BasePart) {
	return partEs.get(part);
}

const trackPV = makeTrack(PV);

function forEachAddedPart(part: BasePart) {
	part.AncestryChanged.Connect(() => {
		if (!part.IsDescendantOf(Workspace)) {
			partEs.delete(part);
		}
	});
}

function forEachAddedPV(e: Entity, pv: PVInstance) {
	if (pv.IsA("BasePart") && pv.CanCollide) {
		partEs.set(pv, e);
		forEachAddedPart(pv);
	}

	pv.GetDescendants()
		.filter((instance): instance is BasePart => instance.IsA("BasePart") && instance.CanCollide)
		.forEach((part) => {
			partEs.set(part, e);
			forEachAddedPart(part);
		});
}

function forEachRemovedPV(pv: PVInstance) {
	if (pv.IsA("BasePart")) {
		partEs.delete(pv);
	}

	pv.GetDescendants()
		.filter((instance): instance is BasePart => instance.IsA("BasePart"))
		.forEach((part) => {
			partEs.delete(part);
		});
}

onTick.Connect(() => {
	trackPV((changes) => {
		for (const [e, pv] of changes.added()) {
			forEachAddedPV(e, pv);
		}

		for (const [e, pv, prevPV] of changes.changed()) {
			forEachAddedPV(e, pv);
			forEachRemovedPV(prevPV);
		}

		for (const [e, prevPv] of changes.removed()) {
			if (prevPv === undefined) continue;
			forEachRemovedPV(prevPv);
		}
	});
});
