import { getBindingValue, useEventListener } from "@rbxts/pretty-react-hooks";
import { Binding, useBinding, useMemo, useRef } from "@rbxts/react";
import { createMotion, LinearOptions, Motion, MotionGoal, SpringOptions } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function useMotion(initialValue: number): LuaTuple<[Binding<number>, Motion]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T) {
	const motion = useMemo(() => {
		return createMotion(initialValue);
	}, []);

	const [binding, setValue] = useBinding(initialValue);

	useEventListener(RunService.Heartbeat, (delta) => {
		const value = motion.step(delta);

		if (value !== binding.getValue()) {
			setValue(value);
		}
	});

	return $tuple(binding, motion);
}

export function useSpring(goal: number | Binding<number>, options?: SpringOptions): Binding<number>;

export function useSpring<T extends MotionGoal>(
	goal: T | Binding<T>,
	options?: SpringOptions,
): Binding<T>;

export function useSpring(goal: MotionGoal | Binding<MotionGoal>, options?: SpringOptions) {
	const [binding, motion] = useMotion(getBindingValue(goal));
	const previousValue = useRef(getBindingValue(goal));

	useEventListener(RunService.Heartbeat, () => {
		const currentValue = getBindingValue(goal);

		if (currentValue !== previousValue.current) {
			previousValue.current = currentValue;
			motion.spring(currentValue, options);
		}
	});

	return binding;
}

export function useLinear(goal: number | Binding<number>, options?: LinearOptions): Binding<number>;

export function useLinear<T extends MotionGoal>(
	goal: T | Binding<T>,
	options?: LinearOptions,
): Binding<T>;

export function useLinear(goal: MotionGoal | Binding<MotionGoal>, options?: LinearOptions) {
	const [binding, motion] = useMotion(getBindingValue(goal));
	const previousValue = useRef(getBindingValue(goal));

	useEventListener(RunService.Heartbeat, () => {
		const currentValue = getBindingValue(goal);

		if (currentValue !== previousValue.current) {
			previousValue.current = currentValue;
			motion.linear(currentValue, options);
		}
	});

	return binding;
}
