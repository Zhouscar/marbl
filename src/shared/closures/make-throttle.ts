export function makeThrottle(duration: number) {
	let lastTime = -1;

	return (fn: () => void) => {
		if (os.clock() < lastTime + duration) return;
		lastTime = os.clock();
		fn();
	};
}
