import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { PerFrameFunction, scheduleTick } from "shared/utils/per-frame";

export function useScheduleTick(fn: PerFrameFunction, priority?: number) {
	useMountEffect(() => {
		scheduleTick(fn, priority);
	});
}
