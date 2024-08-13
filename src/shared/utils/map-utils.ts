export function forEach<V, T extends { [V in keyof T & string]: V }>(
	map: T,
	callback: (value: V) => void,
) {
	(map as unknown as Map<keyof T, V>).forEach((value) => {
		callback(value);
	});
}
