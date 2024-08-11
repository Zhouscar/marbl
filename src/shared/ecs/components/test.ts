import { world } from "../world";
import { Replicated } from "./network";

export const Test = world.component<number>();
world.add(Test, Replicated);

export const Attacker = world.component<undefined>();
world.add(Attacker, Replicated);

export const AttackedBy = world.component<undefined>();
world.add(AttackedBy, Replicated);
