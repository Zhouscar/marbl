import { world } from "../world";
import { Replicated } from "./network";

export const PV = world.component<PVInstance>();
world.add(PV, Replicated);
