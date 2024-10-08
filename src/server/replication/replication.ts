import { Component, Entity, pair, Wildcard } from "@rbxts/jecs";
import Sift from "@rbxts/sift";
import { makeMemos } from "shared/closures/make-memos";
import { makeTrack } from "shared/closures/make-track";
import { makeTrackPairWildCard } from "shared/closures/make-track-pair-wildcard";
import { PseudoComponent, Replicated, ReplicatedPair } from "shared/components";
import { remotes } from "shared/remotes";
import { ComponentDataContainer, ReplicationMap } from "shared/serdes";
import { scheduleTick } from "shared/utils/per-frame";
import { world } from "shared/world";

const trackMemos = makeMemos();
const trackPairWildCardMemos = makeMemos();

function shouldTreatAsEntity(e: Entity) {
	return !world.has(e, Component) && !world.has(e, PseudoComponent);
}

function setSet(
	map: ReplicationMap,
	ekey: string,
	componentKey: string,
	container: ComponentDataContainer,
) {
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
	}

	for (const [component] of world.query(ReplicatedPair)) {
		for (const [e, data] of world.query(pair(component, Wildcard))) {
			const second = world.target(e, component);
			if (second === undefined) continue;
			const Pair = pair(component, second);
			setSet(worldPayload, tostring(e), tostring(Pair), {
				data: data,
				isTag: data === undefined,
				pair: {
					first: component,
					second: second,
					secondIsEntity: shouldTreatAsEntity(second),
				},
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
	}

	for (const [component] of world.query(ReplicatedPair)) {
		trackPairWildCardMemos(
			() => makeTrackPairWildCard(component),
			[],
			tostring(component),
		)((changes) => {
			for (const [e, target, data] of changes.added()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: data,
					isTag: data === undefined,
					pair: {
						first: component,
						second: target,
						secondIsEntity: shouldTreatAsEntity(target),
					},
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
					pair: {
						first: component,
						second: target,
						secondIsEntity: shouldTreatAsEntity(target),
					},
				});
			}

			for (const [e, target, _prevData] of changes.removed()) {
				setSet(worldChanges, tostring(e), tostring(pair(component, target)), {
					data: undefined,
					isTag: undefined,
					pair: {
						first: component,
						second: target,
						secondIsEntity: shouldTreatAsEntity(target),
					},
				});
			}
		});
	}

	if (!worldChanges.isEmpty()) {
		remotes.world.replicate.fireAll(worldChanges);
	}
}, math.huge);
