import { MotionGoal, SpringOptions } from "@rbxts/ripple";
import { useMotion } from "./ripple";
import React, { useEffect } from "@rbxts/react";

export function useSpringed<T>(
	container: T,
	key: ExtractKeys<T, number>,
	stepEvent: RBXScriptSignal,
	options?: SpringOptions,
): React.Binding<number>;

export function useSpringed<T, U extends MotionGoal>(
	container: T,
	key: Extract<keyof T, U>,
	stepEvent: RBXScriptSignal,
	options?: SpringOptions,
): React.Binding<U>;

export function useSpringed<T, U extends MotionGoal>(
	container: T,
	key: Extract<keyof T, U>,
	stepEvent: RBXScriptSignal,
	options?: SpringOptions,
) {
	const [spring, api] = useMotion(container[key] as MotionGoal);

	useEffect(() => {
		const connection = stepEvent.Connect(() => {
			api.spring(container[key] as MotionGoal, options);
		});

		return () => {
			connection.Disconnect();
		};
	}, [stepEvent]);

	return spring;
}
