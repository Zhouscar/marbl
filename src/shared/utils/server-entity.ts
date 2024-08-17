import { Entity } from "@rbxts/jecs";
import { ServerE } from "shared/components";
import { world } from "shared/world";

export function getServerEFromClient(e?: Entity) {
	return e === undefined ? undefined : world.get(e, ServerE);
}
