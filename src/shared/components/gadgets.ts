import { GadgetName, GadgetVariant } from "shared/gadgets";
import { Replicated, ReplicatedPair } from "./network";
import { world } from "shared/world";
import { Motion } from "@rbxts/ripple";

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

export const NameOfGadget = world.component<GadgetName>();
world.add(NameOfGadget, Replicated);

export const VariantOfGadget = world.component<GadgetVariant>();
world.add(VariantOfGadget, Replicated);

export const GadgetVariantAs = world.component();
world.add(GadgetVariantAs, ReplicatedPair);

export const GadgetNameAs = world.component();
world.add(GadgetNameAs, ReplicatedPair);

export const GadgetRotationOffset = world.component<CFrame>();
world.add(GadgetRotationOffset, Replicated);

export const GadgetImplicitAngularYMotion = world.component<{
	goal: number;
	api: Motion<number>;
}>();
