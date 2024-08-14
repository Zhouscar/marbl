import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { LAST_E } from "shared/constants/core";
import { onTick } from "shared/utils/per-frame";
import { getPlayerE } from "shared/utils/player-utils";

function _getLocalE() {
	return getPlayerE(Players.LocalPlayer) ?? LAST_E;
}

let _localE = _getLocalE();

onTick.Connect(() => {
	_localE = _getLocalE();
});

export function useLocalE() {
	const [e, setE] = useState(_localE);
	const eRef = useLatest(e);

	useEventListener(onTick, () => {
		if (eRef.current === _localE) return;
		setE(_localE);
	});

	return e;
}
