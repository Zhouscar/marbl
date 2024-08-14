import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { onTick } from "shared/utils/per-frame";

export function useRefStated<T>(ref: React.MutableRefObject<T>) {
	const [state, setState] = useState(ref.current);
	const latestState = useLatest(state);

	useEventListener(onTick, () => {
		if (ref.current === latestState.current) return;
		setState(ref.current);
	});

	return state;
}

export function useStated<T, U>(container: T, key: Extract<keyof T, U>) {
	const [state, setState] = useState(container[key]);
	const latestState = useLatest(state);

	useEventListener(onTick, () => {
		if (container[key] === latestState.current) return;
		setState(container[key]);
	});

	return state;
}
