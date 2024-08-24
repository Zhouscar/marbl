import { useEffect } from "@rbxts/react";
import { onRender, onTick } from "shared/utils/per-frame";

export function useOnRender(fn: (dt: number) => void, deps: unknown[] = []) {
	useEffect(() => {
		const disconnect = onRender(fn);
		return disconnect;
	}, deps ?? []);
}
