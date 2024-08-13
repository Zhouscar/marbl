import { Modify } from "@rbxts/altmake";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import variantModule, { fields, TypeNames, VariantOf } from "@rbxts/variant";
import { Replicated, world } from "shared/ecs";
import { makeIdentifierEntities } from "shared/utils/identifier-entities";
import { findPath, waitForPath } from "shared/utils/indexing-utils";
import { forEach } from "shared/utils/map-utils";

const gadgetsFolder = waitForPath(ReplicatedStorage, "assets/models/gadgets", "Folder");

export const GadgetType = variantModule({
	gun_semi: fields<{}>(),
	gun_auto: fields<{}>(),
	melee_stab: fields<{}>(),
	melee_spin: fields<{}>(),
});
export type GadgetType<T extends TypeNames<typeof GadgetType> = undefined> = VariantOf<
	typeof GadgetType,
	T
>;

export const Gadgets = {
	test: GadgetType.gun_semi({}),
	testMelee: GadgetType.melee_spin({}),
};

export type GadgetName = keyof typeof Gadgets;

export const GadgetNameIdentifiers = makeIdentifierEntities(Gadgets);
export const GadgetTypeIdentifiers = makeIdentifierEntities(GadgetType);

export function getGadgetPV(gadgetName: GadgetName) {
	const gadgetAsset = findPath(gadgetsFolder, gadgetName, "Model");
	assert(gadgetAsset);

	const newGadget = gadgetAsset.Clone();
	Modify(newGadget, {
		Parent: Workspace,
	});
	return newGadget;
}

for (const [gadgetName, _] of pairs(Gadgets)) {
	const gadgetAsset = findPath(gadgetsFolder, gadgetName, "Model");
	assert(gadgetAsset, `Gadget "${gadgetName}" does not have a model`);
}
