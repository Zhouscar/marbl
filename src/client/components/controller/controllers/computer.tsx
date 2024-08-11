import React, { useEffect, useMemo } from "@rbxts/react";
import { ControllerDeviceProps } from "../controller";
import { useDeferEffect, useEventListener, useKeyPress } from "@rbxts/pretty-react-hooks";
import { UserInputService } from "@rbxts/services";
import { useSettings } from "client/hooks/use-settings";

export function ComputerController({ move, zoom, rotate, jump }: ControllerDeviceProps) {
	const forward = useKeyPress(["W", "Up"]);
	const backward = useKeyPress(["S", "Down"]);
	const left = useKeyPress(["A", "Left"]);
	const right = useKeyPress(["D", "Right"]);
	const space = useKeyPress(["Space"]);

	const settings = useSettings();

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

	useDeferEffect(() => {
		move(direction);
	}, [direction]);

	return <></>;
}
