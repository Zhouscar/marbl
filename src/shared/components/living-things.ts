import { world } from "../../world";
import { EntityType } from "@rbxts/jecs";
import { InitGadgets } from "./gadgets";

export const Living = world.component<undefined>();

export const InitMarbl = world.component<{
	player?: Player;
	cf: CFrame;
	color: Color3;
	material: Enum.Material;
	gadgets?: EntityType<typeof InitGadgets>;
}>();

export const Marbl = world.component<undefined>();
world.add(Marbl, Living);
