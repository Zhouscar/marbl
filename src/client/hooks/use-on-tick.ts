import { useEffect } from "@rbxts/react";
import { onTick } from "shared/utils/per-frame";

export function useOnTick(fn: (dt: number) => void, deps: unknown[] = []) {
	useEffect(() => {
		const disconnect = onTick(fn);
		return disconnect;
	}, deps);
}
