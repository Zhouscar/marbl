import { Workspace } from "@rbxts/services";

export function gameTime() {
	return Workspace.GetServerTimeNow();
}
