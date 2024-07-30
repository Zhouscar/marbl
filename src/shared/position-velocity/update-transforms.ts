import { pair } from "@rbxts/jecs";
import { Workspace } from "@rbxts/services";
import { makeTrack, Renderable, Transform, world } from "shared/ecs";
import { scheduleTick } from "shared/utils/per-frame";
import { getPvPrimaryPart } from "shared/utils/pv-utils";

const trackRenderable = makeTrack(Renderable);
const trackTransform = makeTrack(Transform);

scheduleTick(() => {
	for (const [e, _] of world.query(Transform).without(Renderable)) {
		world.remove(e, Transform);
	}

	trackTransform((transformChanges) => {
		for (const [e, transform] of transformChanges.added()) {
			const pv = world.get(e, Renderable);
			if (pv === undefined || transform._doNotReconcile) continue;

			pv.PivotTo(transform.cf);
		}

		for (const [e, transform] of transformChanges.changed()) {
			const pv = world.get(e, Renderable);
			if (pv === undefined || transform._doNotReconcile) continue;

			pv.PivotTo(transform.cf);
		}
	});

	trackRenderable((renderableChanges) => {
		for (const [e, pv] of renderableChanges.added()) {
			const transform = world.get(e, Transform);

			if (transform === undefined) {
				world.set(e, Transform, { cf: pv.GetPivot(), _doNotReconcile: true });
				continue;
			}

			pv.PivotTo(transform.cf);
		}

		for (const [e, pv] of renderableChanges.changed()) {
			const transform = world.get(e, Transform);

			if (transform === undefined) {
				world.set(e, Transform, { cf: pv.GetPivot(), _doNotReconcile: true });
				continue;
			}

			pv.PivotTo(transform.cf);
		}
	});

	for (const [e, pv, transform] of world.query(Renderable, Transform)) {
		const part = getPvPrimaryPart(pv);
		if (part === undefined || part.Anchored) continue;

		if (transform.cf.Y < Workspace.FallenPartsDestroyHeight) {
			world.clear(e);
			continue;
		}

		if (transform.cf !== pv.GetPivot()) {
			world.set(e, Transform, { cf: pv.GetPivot(), _doNotReconcile: true });
		}
	}
});
