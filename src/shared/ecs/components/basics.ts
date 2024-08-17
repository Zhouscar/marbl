import ObjectCache from "@rbxts/object-cache";
import { world } from "../world";
import { Replicated } from "./network";

export const PV = world.component<PVInstance>();

export const CachedInstance = world.component<{
	instance: BasePart | Model;
	objectCache: ObjectCache<BasePart | Model>;
}>();

export const PremadeRaycastParams = world.component<RaycastParams>();

export const ServerPV = world.component<undefined>();
world.add(ServerPV, Replicated);

export const ChangeCF = world.component<CFrame>();

export const Plr = world.component<Player>();
world.add(Plr, Replicated);
