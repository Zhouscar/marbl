import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

const containers = [
	ReplicatedStorage.WaitForChild("shared"),
	ServerScriptService.WaitForChild("server"),
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
