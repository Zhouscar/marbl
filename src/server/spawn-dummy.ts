import { makeTrack } from "shared/closures/make-track";
import { Health, InitMarbl } from "shared/components";
import { onTick } from "shared/utils/per-frame";
import { world } from "shared/world";

task.wait(1);

const e = world.entity();

print(e);
world.set(e, InitMarbl, {
	health: 100,
	cf: new CFrame(0, 0, 10),
	color: Color3.fromRGB(255, 0, 0),
	material: Enum.Material.Marble,
});

const track = makeTrack(Health);

onTick(() => {
	track((changes) => {
		for (const [e, health] of changes.changed()) {
			print(health);
		}
	});
});
