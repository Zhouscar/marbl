import { Modify } from "@rbxts/altmake";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import variantModule, { fields, TypeNames, VariantOf } from "@rbxts/variant";
import { makeIdentifierEntities } from "shared/utils/identifier-entities";
import { findPath, waitForPath } from "shared/utils/indexing-utils";

const gadgetsFolder = waitForPath(ReplicatedStorage, "assets/models/gadgets", "Folder");

export const GadgetVariant = variantModule({
	gun_semi: fields<{}>(),
	gun_auto: fields<{}>(),
	melee_stab: fields<{}>(),
	melee_spin: fields<{}>(),
});
export type GadgetVariant<T extends TypeNames<typeof GadgetVariant> = undefined> = VariantOf<
	typeof GadgetVariant,
	T
>;

export const Gadgets = {
	test: GadgetVariant.gun_semi({}),
	testMelee: GadgetVariant.melee_spin({}),
};

export type GadgetName = keyof typeof Gadgets;

export const GadgetNameIdEs = makeIdentifierEntities(Gadgets);
export const GadgetVariantIdEs = makeIdentifierEntities(GadgetVariant);

export function getGadgetPV(gadgetName: GadgetName) {
	const gadgetAsset = findPath(gadgetsFolder, gadgetName, "Model");
	assert(gadgetAsset);

	const newGadget = gadgetAsset.Clone();
	Modify(newGadget, {
		Parent: Workspace,
	});
	return newGadget;
}
