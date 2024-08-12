import { world } from "../world";
import { Replicated } from "./network";

export const GadgetOf = world.component();
world.add(GadgetOf, Replicated);

export const GadgetRotationOffset = world.component<CFrame>();
world.add(GadgetRotationOffset, Replicated);
