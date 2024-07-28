import { ReplicatedStorage } from "@rbxts/services";

const containers = [ReplicatedStorage.WaitForChild("client"), ReplicatedStorage.WaitForChild("shared")];

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
