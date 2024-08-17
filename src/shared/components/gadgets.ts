import { GadgetName } from "shared/gadgets";
import { Replicated, ReplicatedPair } from "./network";
import { world } from "shared/world";

export const InitGadgets = world.component<
	{
		gadgetName: GadgetName;
		rotationOffset: CFrame;
	}[]
>();

export const GunOfGadget = world.component<{ body: Model; shootPart: BasePart }>();
export const MeleeOfGadget = world.component<{ body: Model; casterAttachments: Attachment[] }>();

export const GadgetOf = world.component();
world.add(GadgetOf, ReplicatedPair);

export const GadgetVariantAs = world.component();
world.add(GadgetVariantAs, ReplicatedPair);

export const GadgetNameAs = world.component();
world.add(GadgetNameAs, ReplicatedPair);

export const GadgetRotationOffset = world.component<CFrame>();
world.add(GadgetRotationOffset, Replicated);
