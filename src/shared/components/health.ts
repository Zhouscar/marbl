import { world } from "shared/world";
import { Replicated } from "./network";
import { DamageContext } from "shared/damage/damage-context";

export const Health = world.component<number>();
// I'm planning to not even use max health for this because the concept of max health is not really all that realistic
world.add(Health, Replicated);

// Init Damage on a complete new entity
export const InitDamage = world.component<DamageContext>();

export const DamageFrom = world.component();
export const DamageTo = world.component();
export const DamageAmount = world.component<number>();
