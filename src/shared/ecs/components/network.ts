import { world } from "../world";

export const Replicated = world.component<undefined>();
export const ReplicatedPair = world.component<undefined>();

export const ClientInitializedBy = world.component<Player>();

export const PseudoComponent = world.component<undefined>();
