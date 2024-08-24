import { useLatest } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useOnTick } from "./use-on-tick";

export function useRefStated<T>(ref: React.MutableRefObject<T>) {
	const [state, setState] = useState(ref.current);
	const latestState = useLatest(state);

	useOnTick(() => {
		if (ref.current === latestState.current) return;
		setState(ref.current);
	});

	return state;
}

export function useStated<T, U>(container: T, key: Extract<keyof T, U>) {
	const [state, setState] = useState(container[key]);
	const latestState = useLatest(state);

	useOnTick(() => {
		if (container[key] === latestState.current) return;
		setState(container[key]);
	});

	return state;
}
