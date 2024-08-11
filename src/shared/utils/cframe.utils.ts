export function createCustomRotation(upVector: Vector3, forwardVector: Vector3) {
	upVector = upVector.Unit;
	forwardVector = forwardVector.Unit;
	const rightVector = upVector.Cross(forwardVector).Unit;
	forwardVector = rightVector.Cross(upVector).Unit;
	const cf = CFrame.fromMatrix(Vector3.zero, rightVector, upVector, forwardVector);
	return cf;
}
