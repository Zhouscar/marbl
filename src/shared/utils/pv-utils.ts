export function getPvPrimaryPart(pv: PVInstance) {
	return pv.IsA("BasePart") ? pv : pv.IsA("Model") ? pv.PrimaryPart : undefined;
}

export function getPvAnyPart(pv: PVInstance) {
	return pv.IsA("BasePart")
		? pv
		: pv.IsA("Model")
			? pv.PrimaryPart !== undefined
				? pv.PrimaryPart
				: pv.FindFirstChildWhichIsA("BasePart")
			: undefined;
}
