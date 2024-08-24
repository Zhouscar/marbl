import { useLatest } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { LAST_E } from "shared/constants/core";
import { getCharE } from "shared/utils/player-utils";
import { useLocalPlrE } from "./use-local-plr-e";
import { useOnTick } from "./use-on-tick";

export function useLocalCharE() {
	const localPlayerE = useLocalPlrE();

	const [e, setE] = useState(LAST_E);
	const eRef = useLatest(e);

	useOnTick(() => {
		const newE = localPlayerE !== LAST_E ? (getCharE(localPlayerE) ?? LAST_E) : LAST_E;

		if (eRef.current === newE) return;
		setE(newE);
	}, [localPlayerE]);

	return e;
}
