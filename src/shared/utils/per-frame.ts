import { RunService } from "@rbxts/services";

export function onRender(fn: (dt: number) => void) {
	RunService.RenderStepped.Connect(fn);
}

export function onPhysics(fn: (dt: number) => void) {
	RunService.Stepped.Connect(fn);
}

export function onTick(fn: (dt: number) => void) {
	RunService.Heartbeat.Connect(fn);
}
