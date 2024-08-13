import { Modify } from "@rbxts/altmake";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { waitForPath } from "shared/utils/indexing-utils";

const marbl = waitForPath(ReplicatedStorage, "assets/models/marbl", "Part");

export function getMarblPV() {
	const newMarbl = marbl.Clone();
	Modify(newMarbl, {
		Parent: Workspace,
	});
	return newMarbl;
}
