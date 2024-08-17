import { Entity } from "@rbxts/jecs";
import { useLatest } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/react";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

export function useComponent<T>(e: Entity, component: Entity<T>) {
	const [data, setData] = useState(() => world.get(e, component));
	const lastestData = useLatest(data);

	useEffect(() => {
		const connection = onTick.Connect(() => {
			const newData = world.get(e, component);
			if (newData === lastestData.current) return;

			setData(newData);
		});

		return () => {
			connection.Disconnect();
		};
	}, [e]);

	return data;
}
