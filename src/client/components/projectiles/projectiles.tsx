import React from "@rbxts/react";
import { ProjectilesVisual } from "./projectiles-visuals";
import { ProjectilesHit } from "./projectiles-hit";

export function Projectiles() {
	return (
		<>
			<ProjectilesVisual />;
			<ProjectilesHit />
		</>
	);
}
// projectiles visualize
// how do I know when a projectile is removed then? oh wait, you don't, because it is client initiated.
