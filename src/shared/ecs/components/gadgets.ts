import { GadgetName } from "shared/gadgets";
import { world } from "../world";
import { Replicated, ReplicatedPair } from "./network";

export const InitGadgets = world.component<
	{
		gadgetName: GadgetName;
		rotationOffset: CFrame;
	}[]
>();

export const GadgetOf = world.component();
world.add(GadgetOf, ReplicatedPair);

export const GadgetTypeAs = world.component();
world.add(GadgetTypeAs, ReplicatedPair);

export const GadgetNameAs = world.component();
world.add(GadgetNameAs, ReplicatedPair);

export const GadgetRotationOffset = world.component<CFrame>();
world.add(GadgetRotationOffset, Replicated);
