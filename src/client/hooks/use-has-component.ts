import { Entity } from "@rbxts/jecs";
import { useLatest } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/react";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

export function useHasComponent<T>(e: Entity, component: Entity<T>) {
	const [exist, setExist] = useState(() => world.has(e, component));
	const lastestExist = useLatest(exist);

	useEffect(() => {
		const disconnect = onTick(() => {
			const newExist = world.has(e, component);
			if (newExist === lastestExist.current) return;

			setExist(newExist);
		});

		return disconnect;
	}, [e]);

	return exist;
}
