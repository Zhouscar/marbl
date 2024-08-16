import { ProjectileEndTime, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";
import { gameTime } from "shared/utils/time-utils";

scheduleTick(() => {
	for (const [e, endTime] of world.query(ProjectileEndTime)) {
		if (endTime > gameTime()) continue;
		world.clear(e);
	}
});
