import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { LAST_E } from "shared/constants/core";
import { onTick } from "shared/utils/per-frame";
import { getPlrE } from "shared/utils/player-utils";

function _getLocalPlrE() {
	return getPlrE(Players.LocalPlayer) ?? LAST_E;
}

let _localPlrE = _getLocalPlrE();

onTick.Connect(() => {
	_localPlrE = _getLocalPlrE();
});

export function useLocalPlrE() {
	const [e, setE] = useState(_localPlrE);
	const eRef = useLatest(e);

	useEventListener(onTick, () => {
		if (eRef.current === _localPlrE) return;
		setE(_localPlrE);
	});

	return e;
}
