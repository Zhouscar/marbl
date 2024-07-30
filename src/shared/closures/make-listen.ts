export function makeListen() {
	const instanceSignals: Map<Instance, Set<RBXScriptSignal>> = new Map();

	const signalQueues: Map<RBXScriptSignal, unknown[][]> = new Map();
	const signalConnections: Map<RBXScriptSignal, RBXScriptConnection> = new Map();

	return <A extends unknown[]>(
		instance: Instance,
		signal: RBXScriptSignal<(...args: A) => void>,
		fn: (...args: A) => void,
	) => {
		let signals = instanceSignals.get(instance);
		if (signals === undefined) {
			signals = new Set();
			instanceSignals.set(instance, signals);
			instance.Destroying.Once(() => {
				task.defer(() => {
					instanceSignals.delete(instance);
					signalQueues.delete(signal);
					signalConnections.get(signal)?.Disconnect();
					signalConnections.delete(signal);
				});
			});
		}
		signals.add(signal);

		let queue = signalQueues.get(signal);
		if (queue === undefined) {
			queue = [];
			signalQueues.set(signal, queue);
		}

		let connection = signalConnections.get(signal);
		if (connection === undefined) {
			connection = signal.Connect((...args) => {
				queue.push(args);
			});
			signalConnections.set(signal, connection);
		}

		let args = queue.shift();
		while (args !== undefined) {
			fn(...(args as A));
			args = queue.shift();
		}
	};
}
