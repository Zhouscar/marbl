import { EntityType } from "@rbxts/jecs";
import { InitGadgets } from "./gadgets";
import { world } from "shared/world";
import { Replicated } from "./network";

export const Living = world.component<undefined>();

export const Health = world.component<number>();
// I'm planning to not even use max health for this because the concept of max health is not really all that realistic
world.add(Health, Replicated);

export const InitMarbl = world.component<{
	player?: Player;
	health: number;
	cf: CFrame;
	color: Color3;
	material: Enum.Material;
	gadgets?: EntityType<typeof InitGadgets>;
}>();

export const Marbl = world.component<undefined>();
world.add(Marbl, Living);
world.add(Marbl, Replicated);
