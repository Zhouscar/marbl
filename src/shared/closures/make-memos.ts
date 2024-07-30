import Sift from "@rbxts/sift";

export function makeMemos() {
	const valueMap: Map<unknown, unknown> = new Map();
	const prevDependenciesMap: Map<unknown, unknown[]> = new Map();

	return <T>(factory: () => T, dependencies: unknown[], discriminator: unknown): T => {
		let value = valueMap.get(discriminator) as T | undefined;
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
