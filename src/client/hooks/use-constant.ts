import { useMemo } from "@rbxts/react";

export function useConstant<T>(value: T) {
	const constant = useMemo(() => value, []);
	return constant;
}
