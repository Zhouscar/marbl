import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { PerFrameFunction, scheduleRender } from "shared/utils/per-frame";

export function useScheduleRender(fn: PerFrameFunction, priority?: number) {
	useMountEffect(() => {
		scheduleRender(fn, priority);
	});
}
