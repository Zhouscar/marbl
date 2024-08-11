import { world } from "../world";

export const Living = world.component<undefined>();

export const Marbl = world.component<undefined>();
world.add(Marbl, Living);
