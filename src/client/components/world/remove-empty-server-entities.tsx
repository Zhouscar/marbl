import React from "@rbxts/react";
import { useConstant } from "client/hooks/use-constant";
import { useScheduleTick } from "client/hooks/use-schedule-tick";
import { makeTrack } from "shared/closures/make-track";
import { ServerE } from "shared/components";
import { world } from "shared/world";

export function RemoveEmptyServerEntities() {
	const trackServerE = useConstant(makeTrack(ServerE));

	useScheduleTick(() => {
		trackServerE((changes) => {
			for (const [e, _] of changes.removed()) {
				world.delete(e);
			}
		});
	});

	return <></>;
}
