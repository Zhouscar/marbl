import { Modify } from "@rbxts/altmake";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { findPath, waitForPath } from "shared/utils/indexing-utils";

const gadgetsFolder = waitForPath(ReplicatedStorage, "assets/models/gadgets", "Folder");

export type GadgetType = "test";

export function getGadget(gadgetType: GadgetType) {
	const gadgetAsset = findPath(gadgetsFolder, gadgetType, "Model");
	assert(gadgetAsset);

	const newGadget = gadgetAsset.Clone();
	Modify(newGadget, {
		Parent: Workspace,
	});
	return newGadget;
}
