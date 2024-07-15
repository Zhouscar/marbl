import { Entity } from "@rbxts/jecs";
import { RunService } from "@rbxts/services";
import { initComponents, makeTrack, Replicated, TrackFunction, world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { ReplicationMap } from "shared/serdes";

export async function initReplication() {
	initComponents();

	const replicatedComponents: Entity[] = [];
	for (const [component] of world.query(Replicated)) {
		replicatedComponents.push(component);
	}

	const trackMap: Map<string, TrackFunction> = new Map();
	replicatedComponents.forEach((component) => {
		trackMap.set(tostring(component), makeTrack(component));
	});

	function setSet(map: ReplicationMap, ekey: string, componentKey: string, container: { data?: unknown }) {
		let componentMap = map.get(ekey);

		if (componentMap === undefined) {
			componentMap = new Map();
			map.set(ekey, componentMap);
		}

		componentMap.set(componentKey, container);
	}

	remotes.world.start.connect((player) => {
		const worldPayload: ReplicationMap = new Map();

		replicatedComponents.forEach((component) => {
			for (const [e, data] of world.query(component)) {
				setSet(worldPayload, tostring(e), tostring(component), { data: data });
			}
		});

		remotes.world.replicate.fire(player, worldPayload);
	});

	RunService.Heartbeat.Connect(() => {
		const worldChanges: ReplicationMap = new Map();

		replicatedComponents.forEach((component) => {
			trackMap.get(tostring(component))!((changes) => {
				for (const [e, data] of changes.added()) {
					setSet(worldChanges, tostring(e), tostring(component), { data: data });
				}

				for (const [e, data, prevData] of changes.changed()) {
					if (data === prevData) continue;
					setSet(worldChanges, tostring(e), tostring(component), { data: data });
				}

				for (const [e] of changes.changed()) {
					setSet(worldChanges, tostring(e), tostring(component), { data: undefined });
				}
			});
		});

		if (!worldChanges.isEmpty()) {
			remotes.world.replicate.fireAll(worldChanges);
		}
	});
}
