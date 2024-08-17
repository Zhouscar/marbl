import { ProjectileEndTime } from "shared/components";
import { scheduleTick } from "shared/utils/per-frame";
import { gameTime } from "shared/utils/time-utils";
import { world } from "shared/world";

scheduleTick(() => {
	for (const [e, endTime] of world.query(ProjectileEndTime)) {
		if (endTime > gameTime()) continue;
		world.delete(e);
	}
});
