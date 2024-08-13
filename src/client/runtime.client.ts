import { ReplicatedStorage } from "@rbxts/services";

const containers = [
	ReplicatedStorage.WaitForChild("shared"),
	ReplicatedStorage.WaitForChild("client"),
];

containers.forEach((container) => {
	container
		.GetDescendants()
		.filter((instance): instance is ModuleScript => instance.IsA("ModuleScript"))
		.forEach((module) => {
			task.spawn(() => {
				const [ok, reason] = pcall(require, module);
				if (!ok) {
					warn(reason);
				}
			});
		});
});
