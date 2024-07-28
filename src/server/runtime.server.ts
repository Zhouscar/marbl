import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

const containers = [ServerScriptService.WaitForChild("server"), ReplicatedStorage.WaitForChild("shared")];

containers.forEach((container) => {
	container
		.GetDescendants()
		.filter((instance): instance is ModuleScript => instance.IsA("ModuleScript"))
		.forEach((module) => {
			task.spawn(() => {
				require(module);
			});
		});
});
