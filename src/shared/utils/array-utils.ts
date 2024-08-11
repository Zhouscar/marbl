export function randomChoice<T>(arr: T[]) {
	return arr[math.random(0, arr.size() - 1)];
}
