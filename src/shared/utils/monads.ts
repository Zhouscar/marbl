export class Maybe<T> {
	private value: T;

	constructor(value: T) {
		this.value = value;
	}

	bind<R>(fn: (value: NonNullable<T>) => R) {
		if (this.value === undefined) {
			return this;
		}
		const value = fn(this.value as NonNullable<T>);
		return new Maybe(value);
	}

	get() {
		return this.value;
	}
}
