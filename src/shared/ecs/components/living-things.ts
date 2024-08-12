import { GadgetType } from "shared/gadgets";
import { world } from "../world";

export const Living = world.component<undefined>();

export const InitMarbl = world.component<{
	player?: Player;
	cf: CFrame;
	color: Color3;
	material: Enum.Material;
	gadgets: {
		gadgetType: GadgetType;
		rotationOffset: CFrame;
	}[];
}>();

export const Marbl = world.component<undefined>();
world.add(Marbl, Living);
