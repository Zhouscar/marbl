import { world } from "../world";
import { Replicated } from "./network";

export const PV = world.component<PVInstance>();

export const ChangeCF = world.component<CFrame>();

export const ServerPV = world.component<undefined>();
world.add(ServerPV, Replicated);

export const Plr = world.component<Player>();
world.add(Plr, Replicated);
