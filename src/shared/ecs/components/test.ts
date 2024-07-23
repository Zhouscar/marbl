import { world } from "../world";
import { Replicated } from "./network";

export const Test = world.component<number>();
world.add(Test, Replicated);

export const Attacker = world.component();
world.add(Attacker, Replicated);

export const AttackedBy = world.component();
world.add(AttackedBy, Replicated);
