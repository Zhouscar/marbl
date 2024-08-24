import { MotionGoal, SpringOptions } from "@rbxts/ripple";
import { useMotion } from "./ripple";
import React, { useEffect } from "@rbxts/react";

export function useSpringed<T>(
	container: T,
	key: ExtractKeys<T, number>,
	stepper: (fn: (dt: number) => void) => () => void,
	options?: SpringOptions,
): React.Binding<number>;

export function useSpringed<T, U extends MotionGoal>(
	container: T,
	key: Extract<keyof T, U>,
	stepper: (fn: (dt: number) => void) => () => void,
	options?: SpringOptions,
): React.Binding<U>;

export function useSpringed<T, U extends MotionGoal>(
	container: T,
	key: Extract<keyof T, U>,
	stepper: (fn: (dt: number) => void) => () => void,
	options?: SpringOptions,
) {
	const [spring, api] = useMotion(container[key] as MotionGoal);

	useEffect(() => {
		const disconnect = stepper(() => {
			api.spring(container[key] as MotionGoal, options);
		});

		return disconnect;
	}, [stepper]);

	return spring;
}
