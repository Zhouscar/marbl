import { useLatest } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/react";
import { LAST_E } from "shared/constants/core";
import { onTick } from "shared/utils/per-frame";
import { getCharE } from "shared/utils/player-utils";
import { useLocalPlrE } from "./use-local-plr-e";

export function useLocalCharE() {
	const localPlayerE = useLocalPlrE();

	const [e, setE] = useState(LAST_E);
	const eRef = useLatest(e);

	useEffect(() => {
		const connection = onTick.Connect(() => {
			const newE = localPlayerE !== LAST_E ? (getCharE(localPlayerE) ?? LAST_E) : LAST_E;

			if (eRef.current === newE) return;
			setE(newE);
		});
		return () => {
			connection.Disconnect();
		};
	}, [localPlayerE]);

	return e;
}
