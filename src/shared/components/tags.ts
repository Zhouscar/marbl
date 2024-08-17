import { world } from "../../world";

export const Tagged = world.component<string>();

export const TestTag = world.component();
world.set(TestTag, Tagged, "TestTag");
