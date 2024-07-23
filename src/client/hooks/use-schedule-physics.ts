import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { PerFrameFunction, schedulePhysics } from "shared/utils/per-frame";

export function useSchedulePhysics(fn: PerFrameFunction, priority?: number) {
	useMountEffect(() => {
		schedulePhysics(fn, priority);
	});
}
