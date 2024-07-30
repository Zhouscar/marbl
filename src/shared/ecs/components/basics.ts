import { world } from "../world";
import { Replicated } from "./network";

export const Renderable = world.component<PVInstance>();
world.add(Renderable, Replicated);

export const Transform = world.component<{ cf: CFrame; _doNotReconcile?: boolean }>();
