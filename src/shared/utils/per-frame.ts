import { Players, RunService } from "@rbxts/services";
import { IS_CLIENT, IS_SERVER } from "shared/constants/core";

export type PerFrameFunction = (dt: number) => void;

const disconnects: (() => void)[] = [];
if (IS_CLIENT) {
	Players.PlayerRemoving.Connect((player) => {
		if (player !== Players.LocalPlayer) return;
		disconnects.forEach((disconnect) => {
			disconnect();
		});
	});
}
if (IS_SERVER) {
	game.BindToClose(() => {
		disconnects.forEach((disconnect) => {
			disconnect();
		});
	});
}

export function onRender(fn: (dt: number) => void) {
	const connection = RunService.RenderStepped.Connect((dt) => {
		fn(dt);
	});
	disconnects.push(() => {
		connection.Disconnect();
	});
	return () => {
		connection.Disconnect();
	};
}

export function onPhysics(fn: (dt: number) => void) {
	const connection = RunService.Stepped.Connect((_, dt) => {
		fn(dt);
	});
	disconnects.push(() => {
		connection.Disconnect();
	});
	return () => {
		connection.Disconnect();
	};
}

export function onTick(fn: (dt: number) => void) {
	const connection = RunService.Heartbeat.Connect((dt) => {
		fn(dt);
	});
	disconnects.push(() => {
		connection.Disconnect();
	});
	return () => {
		connection.Disconnect();
	};
}

const renderFunctions: { priority: number; fn: PerFrameFunction }[] = [];
const physicsFunctions: { priority: number; fn: PerFrameFunction }[] = [];
const tickFunctions: { priority: number; fn: PerFrameFunction }[] = [];

export function scheduleRender(fn: PerFrameFunction, priority: number = 0) {
	if (!IS_CLIENT) {
		warn("Only client can use RenderStepped");
	}
	renderFunctions.push({ priority: priority, fn: fn });
	table.sort(renderFunctions, (a, b) => a.priority < b.priority);
}

export function schedulePhysics(fn: PerFrameFunction, priority: number = 0) {
	physicsFunctions.push({ priority: priority, fn: fn });
	table.sort(physicsFunctions, (a, b) => a.priority < b.priority);
}

export function scheduleTick(fn: PerFrameFunction, priority: number = 0) {
	tickFunctions.push({ priority: priority, fn: fn });
	table.sort(tickFunctions, (a, b) => a.priority < b.priority);
}

if (IS_CLIENT) {
	onRender((dt) => {
		renderFunctions.forEach((context) => {
			context.fn(dt);
		});
	});
}

onPhysics((dt) => {
	physicsFunctions.forEach((context) => {
		context.fn(dt);
	});
});

onTick((dt) => {
	tickFunctions.forEach((context) => {
		context.fn(dt);
	});
});
