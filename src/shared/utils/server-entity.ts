import { Entity } from "@rbxts/jecs";
import { ServerE, world } from "shared/ecs";

export function getServerEFromClient(e?: Entity) {
	return e === undefined ? undefined : world.get(e, ServerE);
}
