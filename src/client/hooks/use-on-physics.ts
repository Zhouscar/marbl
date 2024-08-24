import { useEffect } from "@rbxts/react";
import { onPhysics } from "shared/utils/per-frame";

export function useOnPhysics(fn: (dt: number) => void, deps: unknown[] = []) {
	useEffect(() => {
		const disconnect = onPhysics(fn);
		return disconnect;
	}, deps);
}
