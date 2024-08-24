import { ServerPV } from "./components";
import { onTick } from "./utils/per-frame";
import { world } from "./world";

let num = 0;
onTick(() => {
	let newNum = 0;
	for (const [_] of world.query(ServerPV)) {
		newNum++;
	}
	if (newNum === num) return;
	num = newNum;
	print(num);
});
