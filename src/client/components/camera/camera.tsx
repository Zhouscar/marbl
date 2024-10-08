import { useCamera } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import { Workspace } from "@rbxts/services";
import { useComponent } from "client/hooks/use-component";
import { useLocalCharE } from "client/hooks/use-local-char-e";
import { useSpringed } from "client/hooks/use-springed";
import { useWorldState } from "client/hooks/use-world-state";
import { PV } from "shared/components";
import { onRender } from "shared/utils/per-frame";

export function Camera() {
	const camera = useCamera();
	const localCharE = useLocalCharE();
	const pv = useComponent(localCharE, PV);
	const worldState = useWorldState();

	const raycastParams = useMemo(() => {
		const params = new RaycastParams();
		params.IgnoreWater = true;
		params.RespectCanCollide = true;
		params.FilterType = Enum.RaycastFilterType.Exclude;
		if (pv !== undefined) {
			params.AddToFilter(pv);
		}
		return params;
	}, [pv]);

	const cameraDistanceSpring = useSpringed(worldState, "cameraDistance", onRender);
	const rotationXSpring = useSpringed(worldState, "rotationX", onRender);
	const rotationYSpring = useSpringed(worldState, "rotationY", onRender);

	useEffect(() => {
		if (pv === undefined) return;

		const disconnect = onRender(() => {
			const rotation = CFrame.fromEulerAnglesYXZ(
				rotationXSpring.getValue(),
				rotationYSpring.getValue(),
				0,
			);

			const _cf = rotation.add(pv.GetPivot().Position);

			const correctedDistance = cameraDistanceSpring.getValue();
			// const distanceCorrectionResult = Workspace.Raycast(
			// 	_cf.Position,
			// 	_cf.LookVector.mul(-(cameraDistanceSpring.getValue() + 2)),
			// 	raycastParams,
			// );
			// if (distanceCorrectionResult !== undefined) {
			// 	correctedDistance = math.max(
			// 		distanceCorrectionResult.Position.sub(_cf.Position).Magnitude - 2,
			// 		2,
			// 	);
			// }

			camera.FieldOfView = correctedDistance + 60;
			camera.CFrame = _cf.sub(_cf.LookVector.mul(correctedDistance / 2));
		});

		return disconnect;
	}, [pv]);

	return <></>;
}
