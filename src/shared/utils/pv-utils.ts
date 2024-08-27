import { getCustomAngularVelocity, getCustomLinearVelocity } from "./memo-forces";

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

export function pseudoAnchor(pv: PVInstance, enabled: boolean) {
	const rootPart = getPvPrimaryPart(pv);
	if (rootPart === undefined) return;
	const linearPseudoAnchor = getCustomLinearVelocity(rootPart, "LinearPseudoAnchor", {
		RelativeTo: Enum.ActuatorRelativeTo.World,
		ForceLimitsEnabled: true,
		ForceLimitMode: Enum.ForceLimitMode.Magnitude,
		MaxForce: math.huge,
		VectorVelocity: Vector3.zero,
	});
	const angularPseudoAnchor = getCustomAngularVelocity(rootPart, "AngularPseudoAnchor", {
		RelativeTo: Enum.ActuatorRelativeTo.World,
		AngularVelocity: Vector3.zero,
		MaxTorque: math.huge,
	});

	linearPseudoAnchor.Enabled = enabled;
	angularPseudoAnchor.Enabled = enabled;
}
