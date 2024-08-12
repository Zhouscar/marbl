import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { LAST_E } from "shared/constants/core";
import { Plr, world } from "shared/ecs";
import { onTick } from "shared/utils/per-frame";

function getLocalE() {
	for (const [e, player] of world.query(Plr)) {
		if (player !== Players.LocalPlayer) continue;
		return e;
	}
	return LAST_E;
}

export function useLocalE() {
	const [e, setE] = useState(getLocalE());
	const eRef = useLatest(e);

	useEventListener(onTick, () => {
		const newE = getLocalE();
		if (eRef.current === newE) return;
		setE(newE);
	});

	return e;
}
