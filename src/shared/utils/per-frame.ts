import { RunService } from "@rbxts/services";

export type PerFrameFunction = (dt: number) => void;

const onRender = RunService.RenderStepped;
const onPhysics = RunService.Stepped;
const onTick = RunService.Heartbeat;

const renderFunctions: { priority: number; fn: PerFrameFunction }[] = [];
const physicsFunctions: { priority: number; fn: PerFrameFunction }[] = [];
const tickFunctions: { priority: number; fn: PerFrameFunction }[] = [];

export function scheduleRender(fn: PerFrameFunction, priority: number = 0) {
	if (!RunService.IsClient()) {
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

if (RunService.IsClient()) {
	onRender.Connect((dt) => {
		renderFunctions.forEach((context) => {
			context.fn(dt);
		});
	});
}

onPhysics.Connect((dt) => {
	physicsFunctions.forEach((context) => {
		context.fn(dt);
	});
});

onTick.Connect((dt) => {
	tickFunctions.forEach((context) => {
		context.fn(dt);
	});
});
