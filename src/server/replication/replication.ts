import { Component, pair, Wildcard } from "@rbxts/jecs";
import Sift from "@rbxts/sift";
import { makeMemos } from "shared/closures/make-memos";
import { makeTrackPairWildCard } from "shared/closures/make-track-pair-wildcard";
import { makeTrack, Replicated, world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { ComponentDataContainer, ReplicationMap } from "shared/serdes";
import { scheduleTick } from "shared/utils/per-frame";

const trackMemos = makeMemos();
const trackPairWildCardMemos = makeMemos();

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
			setSet(worldPayload, tostring(e), tostring(component), {
				data: data,
				isTag: data === undefined,
			});
		}

		for (const [e, data] of world.query(pair(component, Wildcard))) {
			const second = world.target(e, component);
			if (second === undefined) continue;
			const Pair = pair(component, second);
			setSet(worldPayload, tostring(e), tostring(Pair), {
				data: data,
				isTag: data === undefined,
				pair: { first: component, second: second, secondIsEntity: !world.has(e, Component) },
			});
		}
	}

	remotes.world.replicate.fire(player, worldPayload);
});

scheduleTick(() => {
	const worldChanges: ReplicationMap = new Map();
	for (const [component] of world.query(Replicated)) {
		// if (component === 3) {
		// 	print("replicating Plr");
		// }
		// if (component === 2) {
		// 	print("replicating PV");
		// }
		trackMemos(
			() => makeTrack(component),
			[],
			tostring(component),
		)((changes) => {
			for (const [e, data] of changes.added()) {
				print(`${component} ${data}`);
				setSet(worldChanges, tostring(e), tostring(component), {
					data: data,
					isTag: data === undefined,
				});
			}

			for (const [e, data, prevData] of changes.changed()) {
				if (
					data === prevData ||
					(typeOf(data) === "table" &&
						(Sift.Dictionary.equalsDeep(data as object, prevData as object) ||
							Sift.Array.equalsDeep(data as object, prevData as object)))
				)
					continue;
				setSet(worldChanges, tostring(e), tostring(component), {
					data: data,
					isTag: data === undefined,
				});
			}

			for (const [e] of changes.removed()) {
				setSet(worldChanges, tostring(e), tostring(component), {
					data: undefined,
					isTag: undefined,
				});
			}
		});

		trackPairWildCardMemos(
			() => makeTrackPairWildCard(component),
			[],
			tostring(component),
		)((changes) => {
			for (const [e, target, data] of changes.added()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: data,
					isTag: data === undefined,
					pair: { first: component, second: target, secondIsEntity: !world.has(e, Component) },
				});
			}

			for (const [e, target, data, prevData] of changes.changed()) {
				if (
					data === prevData ||
					(typeOf(data) === "table" &&
						(Sift.Dictionary.equalsDeep(data as object, prevData as object) ||
							Sift.Array.equalsDeep(data as object, prevData as object)))
				)
					continue;
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: data,
					isTag: data === undefined,
					pair: { first: component, second: target, secondIsEntity: !world.has(e, Component) },
				});
			}

			for (const [e, target, _prevData] of changes.removed()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: undefined,
					isTag: undefined,
					pair: { first: component, second: target, secondIsEntity: !world.has(e, Component) },
				});
			}
		});
	}

	if (!worldChanges.isEmpty()) {
		print(worldChanges);
		remotes.world.replicate.fireAll(worldChanges);
	}
}, math.huge);
