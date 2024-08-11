import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";

export type InputDevice = "computer" | "gamepad" | "mobile";

const getDevice = (inputType = UserInputService.GetLastInputType()): InputDevice | undefined => {
	if (inputType === Enum.UserInputType.Keyboard || inputType === Enum.UserInputType.MouseMovement) {
		return "computer";
	} else if (inputType === Enum.UserInputType.Gamepad1) {
		return "gamepad";
	} else if (inputType === Enum.UserInputType.Touch) {
		return "mobile";
	}
};

export function useDevice() {
	const [device, setDevice] = useState<InputDevice>(() => {
		return getDevice() ?? "computer";
	});

	useEventListener(UserInputService.LastInputTypeChanged, (inputType) => {
		const newDevice = getDevice(inputType);

		if (newDevice !== undefined) {
			setDevice(newDevice);
		}
	});

	return device;
}
