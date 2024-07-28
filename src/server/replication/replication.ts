import { pair, Wildcard } from "@rbxts/jecs";
import Sift from "@rbxts/sift";
import { makeMemos } from "shared/closures/make-memos";
import { makeTrackPairWildCard, TrackPairWildCardFunction } from "shared/closures/make-track-pair-wildcard";
import { makeTrack, Replicated, TrackFunction, world } from "shared/ecs";
import { remotes } from "shared/remotes";
import { ComponentDataContainer, ReplicationMap } from "shared/serdes";
import { scheduleTick } from "shared/utils/per-frame";

const trackMemos = makeMemos<TrackFunction>();
const trackPairWildCardMemos = makeMemos<TrackPairWildCardFunction>();

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
				pair: { first: component, second: second, secondIsEntity: true }, // TODO: wait for world.has to release
			});
		}
	}

	remotes.world.replicate.fire(player, worldPayload);
});

scheduleTick(() => {
	const worldChanges: ReplicationMap = new Map();
	for (const [component] of world.query(Replicated)) {
		trackMemos(
			() => makeTrack(component),
			[],
			tostring(component),
		)((changes) => {
			for (const [e, data] of changes.added()) {
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
			tostring(tostring(component)),
		)((changes) => {
			for (const [e, target, data] of changes.added()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: data,
					isTag: data === undefined,
					pair: { first: component, second: target, secondIsEntity: true }, // TODO: wait for world.has to release
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
					pair: { first: component, second: target, secondIsEntity: true }, // TODO: wait for world.has to release
				});
			}

			for (const [e, target, _prevData] of changes.removed()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: undefined,
					isTag: undefined,
					pair: { first: component, second: target, secondIsEntity: true }, // TODO: wait for world.has to release
				});
			}
		});
	}

	if (!worldChanges.isEmpty()) {
		remotes.world.replicate.fireAll(worldChanges);
	}
}, math.huge);
