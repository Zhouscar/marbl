import { IS_PAIR, pair } from "@rbxts/jecs";
import { RunService } from "@rbxts/services";
import { makeMemos } from "shared/closures/make-memos";
import { makeTrack, Replicated, TrackFunction, world } from "shared/ecs";
import { Test } from "shared/ecs/components/test";
import { remotes } from "shared/remotes";
import { ComponentDataContainer, ReplicationMap } from "shared/serdes";

const trackMemos = makeMemos<TrackFunction>();

export async function initReplication() {
	function setSet(map: ReplicationMap, ekey: string, componentKey: string, container: ComponentDataContainer) {
		let componentMap = map.get(ekey);

		if (componentMap === undefined) {
			componentMap = new Map();
			map.set(ekey, componentMap);
		}

		componentMap.set(componentKey, container);
	}

	remotes.world.start.connect((player) => {
		const worldPayload: ReplicationMap = new Map();

		for (const [component] of world.query(Replicated)) {
			for (const [e, data] of world.query(component)) {
				setSet(worldPayload, tostring(e), tostring(component), { data: data, isTag: data === undefined });
			}
		}

		remotes.world.replicate.fire(player, worldPayload);
	});

	RunService.Heartbeat.Connect(() => {
		const worldChanges: ReplicationMap = new Map();
		for (const [component] of world.query(Replicated)) {
			trackMemos(
				() => makeTrack(component),
				[],
				tostring(component),
			)((changes) => {
				for (const [e, data] of changes.added()) {
					setSet(worldChanges, tostring(e), tostring(component), { data: data, isTag: data === undefined });
				}

				for (const [e, data, prevData] of changes.changed()) {
					if (data === prevData) continue;
					setSet(worldChanges, tostring(e), tostring(component), { data: data, isTag: data === undefined });
				}

				for (const [e] of changes.removed()) {
					setSet(worldChanges, tostring(e), tostring(component), { data: undefined });
				}
			});
		}

		if (!worldChanges.isEmpty()) {
			remotes.world.replicate.fireAll(worldChanges);
		}
	});
}
