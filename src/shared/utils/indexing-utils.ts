export function findPath<T extends keyof Instances>(
	parent: Instance,
	path: string,
	className: T,
): Instances[T] | undefined {
	let current = parent;
	let cancelled = false;

	path.split("/").forEach((to) => {
		if (cancelled) return;
		if (to === "") return;

		const child = current.FindFirstChild(to);
		if (!child) {
			cancelled = true;
			return;
		}

		current = child;
	});

	return !cancelled && current.IsA(className) ? current : undefined;
}

export function waitForPath<T extends keyof Instances>(parent: Instance, path: string, className: T): Instances[T] {
	let current = parent;

	path.split("/").forEach((to) => {
		if (to === "") return;

		current = current.WaitForChild(to);
	});

	assert(current.IsA(className));

	return current;
}
