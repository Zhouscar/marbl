import Sift from "@rbxts/sift";

export function makeMemo<T>() {
	let value: T | undefined = undefined;
	let prevDependencies: unknown[] = [];

	return (factory: () => T, dependencies: unknown[]) => {
		if (value === undefined) {
			prevDependencies = dependencies;
			value = factory();
			return value;
		}

		if (!dependencies.isEmpty() && !Sift.Array.equals(prevDependencies, dependencies)) {
			prevDependencies = dependencies;
			value = factory();
			return value;
		}

		return value;
	};
}
