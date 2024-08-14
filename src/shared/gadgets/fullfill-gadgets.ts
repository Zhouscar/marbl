import { GadgetVariantAs, GunOfGadget, MeleeOfGadget, PV, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";
import { Gadgets, GadgetVariant, GadgetVariantIdEs } from "./gadgets";
import { findPath, waitForPath } from "shared/utils/indexing-utils";
import { CASTER_ATTACHMENT_NAME } from "shared/constants/core";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { EntityType, pair } from "@rbxts/jecs";

const gadgetsFolder = waitForPath(ReplicatedStorage, "assets/models/gadgets", "Folder");

const GUN_VARIANTS: (keyof typeof GadgetVariant)[] = ["gun_auto", "gun_semi"];
const MELEE_VARIANTS: (keyof typeof GadgetVariant)[] = ["melee_spin", "melee_stab"];

function getGunOfGadget(pv: PVInstance): EntityType<typeof GunOfGadget> | undefined {
	const body = findPath(pv, "body", "Model");
	if (body === undefined) return;

	const shootPart = findPath(body, "shootPart", "BasePart");
	if (shootPart === undefined) return;

	return {
		body,
		shootPart,
	};
}

function getMeleeOfGadget(pv: PVInstance): EntityType<typeof MeleeOfGadget> | undefined {
	const body = findPath(pv, "body", "Model");
	if (body === undefined) return;

	const casterAttachments = body
		.GetDescendants()
		.filter(
			(instance): instance is Attachment =>
				instance.IsA("Attachment") && instance.Name === CASTER_ATTACHMENT_NAME,
		);

	return {
		body,
		casterAttachments,
	};
}

if (RunService.IsServer()) {
	for (const [gadgetName, variantData] of pairs(Gadgets)) {
		const gadgetAsset = findPath(gadgetsFolder, gadgetName, "Model");
		if (gadgetAsset === undefined) {
			warn(`Gadget "${gadgetName}" does not have a model`);
			continue;
		}

		if (GUN_VARIANTS.includes(variantData.type) && getGunOfGadget(gadgetAsset) === undefined) {
			warn(`Gun gadget "${gadgetName}" is not a complete model`);
		}
		if (
			MELEE_VARIANTS.includes(variantData.type) &&
			getMeleeOfGadget(gadgetAsset) === undefined
		) {
			warn(`Melee gadget "${gadgetName}" is not a complete model`);
		}
	}
}

scheduleTick(() => {
	GUN_VARIANTS.forEach((variantName) => {
		for (const [e, pv] of world
			.query(PV, pair(GadgetVariantAs, GadgetVariantIdEs[variantName]))
			.without(GunOfGadget)) {
			const context = getGunOfGadget(pv);
			if (context === undefined) continue;

			world.set(e, GunOfGadget, context);
		}
	});

	MELEE_VARIANTS.forEach((variantName) => {
		for (const [e, pv] of world
			.query(PV, pair(GadgetVariantAs, GadgetVariantIdEs[variantName]))
			.without(MeleeOfGadget)) {
			const context = getMeleeOfGadget(pv);
			if (context === undefined) continue;

			world.set(e, MeleeOfGadget, context);
		}
	});
});
