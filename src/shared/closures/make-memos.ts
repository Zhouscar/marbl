import Sift from "@rbxts/sift";

export function makeMemos<T>() {
	const valueMap: Map<unknown, T> = new Map();
	const prevDependenciesMap: Map<unknown, unknown[]> = new Map();

	return (factory: () => T, dependencies: unknown[], discriminator: unknown) => {
		let value = valueMap.get(discriminator);
		let prevDependencies = prevDependenciesMap.get(discriminator);

		if (value === undefined) {
			prevDependencies = dependencies;
			value = factory();

			prevDependenciesMap.set(discriminator, dependencies);
			valueMap.set(discriminator, value);
			return value;
		}

		if (!dependencies.isEmpty() && !Sift.Array.equals(prevDependencies ?? [], dependencies)) {
			prevDependencies = dependencies;
			value = factory();

			prevDependenciesMap.set(discriminator, dependencies);
			valueMap.set(discriminator, value);
			return value;
		}

		return value;
	};
}
