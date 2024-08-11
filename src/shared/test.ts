import { makeTrack, Plr, PV } from "./ecs";
import { onTick } from "./utils/per-frame";

const track = makeTrack(PV);

onTick.Connect(() => {
	track((changes) => {
		for (const [e, data] of changes.added()) {
			print(`${PV} ${data}`);
		}
	});
});
