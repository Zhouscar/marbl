import { pair, Wildcard } from "@rbxts/jecs";
import { Replicated, ReplicatedPair, ServerE } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [component] of world.query(Replicated)) {
		for (const [e] of world.query(component).without(ServerE)) {
			world.set(e, ServerE, e);
		}
	}

	for (const [component] of world.query(ReplicatedPair)) {
		for (const [e] of world.query(pair(component, Wildcard)).without(ServerE)) {
			world.set(e, ServerE, e);
		}
	}
});
