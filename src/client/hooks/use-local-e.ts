import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { LAST_E } from "shared/constants/core";
import { onTick } from "shared/utils/per-frame";
import { getPlayerE } from "shared/utils/player-utils";

function getLocalE() {
	return getPlayerE(Players.LocalPlayer) ?? LAST_E;
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
