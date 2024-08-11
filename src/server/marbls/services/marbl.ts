import { Modify } from "@rbxts/altmake";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { randomChoice } from "shared/utils/array-utils";
import { waitForPath } from "shared/utils/indexing-utils";

const marbl = waitForPath(ReplicatedStorage, "assets/models/Marbl", "Part");

export function getMarbl() {
	const newMarbl = marbl.Clone();
	Modify(newMarbl, {
		Parent: Workspace,
		Material: randomChoice(Enum.Material.GetEnumItems()),
		Color: Color3.fromRGB(math.random(0, 255), math.random(0, 255), math.random(0, 255)),
	});
	return newMarbl;
}
