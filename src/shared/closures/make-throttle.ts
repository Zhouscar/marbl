export function makeThrottle(duration: number, offset: number = 0) {
	let lastTime = os.clock() + offset - duration;

	return (fn: () => void) => {
		if (os.clock() < lastTime + duration) return;
		lastTime = os.clock();
		fn();
	};
}
