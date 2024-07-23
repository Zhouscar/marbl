import { world } from "../world";
import { Replicated } from "./network";

export const Test = world.component<number>();

world.add(Test, Replicated);
