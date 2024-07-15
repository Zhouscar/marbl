import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { remotes } from "shared/remotes";

export function WorldStarter() {
	useMountEffect(() => {
		remotes.world.start.fire();
	});

	return <></>;
}
