import React, { useEffect, useMemo, useRef } from "@rbxts/react";
import { ControllerDeviceProps } from "../controller";
import { useDeferEffect, useEventListener, useKeyPress } from "@rbxts/pretty-react-hooks";
import { Players, UserInputService } from "@rbxts/services";
import { useSettings } from "client/hooks/use-settings";
import { onPhysics } from "shared/utils/per-frame";
import { useConstant } from "client/hooks/use-constant";

export function ComputerController({ move, zoom, rotate, jump, point, pv }: ControllerDeviceProps) {
	const forward = useKeyPress(["W", "Up"]);
	const backward = useKeyPress(["S", "Down"]);
	const left = useKeyPress(["A", "Left"]);
	const right = useKeyPress(["D", "Right"]);
	const space = useKeyPress(["Space"]);

	const mouse = useConstant(Players.LocalPlayer.GetMouse());
	const settings = useSettings();

	const hitPositionRef = useRef(Vector3.zero);

	const direction = useMemo(() => {
		let _direction = Vector2.zero;
		if (forward) _direction = _direction.add(new Vector2(0, 1));
		if (backward) _direction = _direction.add(new Vector2(0, -1));
		if (left) _direction = _direction.add(new Vector2(-1, 0));
		if (right) _direction = _direction.add(new Vector2(1, 0));
		return _direction;
	}, [forward, backward, left, right]);

	useEffect(() => {
		if (!space) return;
		jump();
	}, [space]);

	useEventListener(UserInputService.InputChanged, (input, gPE) => {
		if (gPE) return;
		if (input.UserInputType === Enum.UserInputType.MouseMovement) {
			rotate(
				-(input.Delta.Y / 8) * settings.MouseSensitivity,
				-(input.Delta.X / 8) * settings.MouseSensitivity,
			);
		}
		if (input.UserInputType === Enum.UserInputType.MouseWheel) {
			zoom(input.Position.Z * -5);
		}
	});

	useEffect(() => {
		mouse.TargetFilter = pv;
	}, [pv]);

	useEventListener(onPhysics, () => {
		if (mouse.Hit.Position !== hitPositionRef.current) {
			hitPositionRef.current = mouse.Hit.Position;
			point(mouse.Hit.Position);
		}
	});

	useDeferEffect(() => {
		move(direction);
	}, [direction]);

	return <></>;
}
