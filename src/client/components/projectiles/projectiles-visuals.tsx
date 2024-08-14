import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { onTick } from "shared/utils/per-frame";

export function ProjectilesVisual() {
	useEventListener(onTick, () => {});
	// TODO

	return <></>;
}
