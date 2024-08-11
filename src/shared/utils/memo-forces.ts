import { Make } from "@rbxts/altmake";

export const getCustomLinearVelocity = (
	part: BasePart,
	name: string,
	options?: Partial<WritableInstanceProperties<LinearVelocity>>,
): LinearVelocity =>
	(part.FindFirstChild(name) as LinearVelocity | undefined) ||
	Make("LinearVelocity", {
		Name: name,
		Attachment0: getAttachment(part),
		Parent: part,
		...options,
	});

export const getCustomVectorForce = (
	part: BasePart,
	name: string,
	options?: Partial<WritableInstanceProperties<VectorForce>>,
): VectorForce =>
	(part.FindFirstChild(name) as VectorForce | undefined) ||
	Make("VectorForce", {
		Name: name,
		Attachment0: getAttachment(part),
		Parent: part,
		...options,
	});

export const getCustomAngularVelocity = (
	part: BasePart,
	name: string,
	options?: Partial<WritableInstanceProperties<AngularVelocity>>,
): AngularVelocity =>
	(part.FindFirstChild(name) as AngularVelocity | undefined) ||
	Make("AngularVelocity", {
		Name: name,
		Attachment0: getAttachment(part),
		Parent: part,
		...options,
	});

export const getAttachment = (part: BasePart): Attachment =>
	part.FindFirstChildWhichIsA("Attachment") || Make("Attachment", { Parent: part });
