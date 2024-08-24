import { Entity } from "@rbxts/jecs";
import { useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { world } from "shared/world";
import { useOnTick } from "./use-on-tick";

export function useComponent<T>(e: Entity, component: Entity<T>) {
	const [data, setData] = useState(() => world.get(e, component));
	const lastestData = useLatest(data);

	useOnTick(() => {
		const newData = world.get(e, component);
		if (newData === lastestData.current) return;

		setData(newData);
	}, [e]);

	return data;
}
