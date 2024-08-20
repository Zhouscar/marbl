import { useCamera, useLatest } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { useDevice } from "client/hooks/use-device";
import { ComputerController } from "./controllers/computer";
import { MobileController } from "./controllers/mobile";
import { GamepadController } from "./controllers/gamepad";
import { useComponent } from "client/hooks/use-component";
import { getPvPrimaryPart } from "shared/utils/pv-utils";
import { useWorldState } from "client/hooks/use-world-state";
import { onPhysics, onTick } from "shared/utils/per-frame";
import { getCustomAngularVelocity, getCustomLinearVelocity } from "shared/utils/memo-forces";
import { Workspace } from "@rbxts/services";
import { Maybe } from "shared/utils/monads";
import { PV } from "shared/components";
import { useLocalCharE } from "client/hooks/use-local-char-e";

export interface ControllerDeviceProps {
	pv?: PVInstance;
	move: (direction: Vector2) => void;
	jump: () => void;
	zoom: (delta: number) => void;
	rotate: (rotateX: number, rotateY: number) => void;
	point: (position: Vector3) => void;
	activate: (activated: boolean) => void;
}

export function Controller() {
	const device = useDevice();

	const localCharE = useLocalCharE();
	const pv = useComponent(localCharE, PV);
	const part = useMemo(() => new Maybe(pv).bind(getPvPrimaryPart).get(), [pv]);

	const camera = useCamera();
	const worldState = useWorldState();

	const raycastParams = useMemo(() => {
		const params = new RaycastParams();
		params.IgnoreWater = true;
		params.RespectCanCollide = true;
		params.FilterType = Enum.RaycastFilterType.Exclude;
		if (pv !== undefined) {
			params.AddToFilter(pv);
		}
		return params;
	}, [pv]);

	const [inputDirection, setInputDirection] = useState(Vector2.zero);
	const [grounded, setGrounded] = useState(false);
	const groundedRef = useLatest(grounded);

	useEffect(() => {
		if (part === undefined) {
			setInputDirection(Vector2.zero);
			setGrounded(false);
			worldState.pointAt = Vector3.zero;
			return;
		}

		part.CustomPhysicalProperties = new PhysicalProperties(1, 2, 0);

		getCustomAngularVelocity(part, "RollFriction", {
			MaxTorque: 1000,
		});

		getCustomLinearVelocity(part, "Movement", {
			RelativeTo: Enum.ActuatorRelativeTo.World,
			ForceLimitsEnabled: true,
			ForceLimitMode: Enum.ForceLimitMode.PerAxis,
			MaxAxesForce: new Vector3(5000, 0, 5000),
		});

		const physicsConnection = onPhysics.Connect(() => {
			const newGrounded =
				Workspace.Raycast(
					part.GetPivot().Position,
					new Vector3(0, -(part.Size.X / 2) - 1, 0),
					raycastParams,
				) !== undefined;

			if (groundedRef.current !== newGrounded) {
				setGrounded(newGrounded);
			}
		});

		return () => {
			physicsConnection.Disconnect();
		};
	}, [part]);

	useEffect(() => {
		if (part === undefined) return;

		const movement = getCustomLinearVelocity(part, "Movement");
		const rollFriction = getCustomAngularVelocity(part, "RollFriction");

		rollFriction.Enabled = inputDirection === Vector2.zero;
		if (inputDirection === Vector2.zero) {
			movement.VectorVelocity = Vector3.zero;
			return;
		}

		const tickConnection = onTick.Connect(() => {
			let velocity = camera.CFrame.LookVector.mul(inputDirection.Y).add(
				camera.CFrame.RightVector.mul(inputDirection.X),
			);
			velocity = new Vector3(velocity.X, 0, velocity.Z).Unit.mul(25);

			movement.VectorVelocity = velocity;
		});

		return () => {
			tickConnection.Disconnect();
		};
	}, [part, inputDirection]);

	const move = useCallback(
		(direction: Vector2) => {
			if (part === undefined) return;

			setInputDirection(direction);
		},
		[part],
	);

	const jump = useCallback(() => {
		if (part === undefined || !grounded) return;

		part.ApplyImpulse(new Vector3(0, 2000, 0));
	}, [part, grounded]);

	const rotate = useCallback(
		(rotateX: number, rotateY: number) => {
			if (part === undefined) return;
			worldState.rotationX += rotateX;
			worldState.rotationY += rotateY;
			worldState.rotationX = math.clamp(
				worldState.rotationX,
				-(math.pi - 0.5) / 2,
				(math.pi - 0.5) / 2,
			);
		},
		[part],
	);

	const zoom = useCallback(
		(delta: number) => {
			if (part === undefined) return;
			worldState.cameraDistance += delta;
			worldState.cameraDistance = math.clamp(worldState.cameraDistance, 10, 50);
		},
		[part],
	);

	const point = useCallback(
		(position: Vector3) => {
			if (part === undefined) return;
			worldState.pointAt = position;
		},
		[part],
	);

	const activate = useCallback(
		(activated: boolean) => {
			if (part === undefined) return;
			if (activated) {
				worldState.activated = true;
			} else {
				task.spawn(() => {
					task.wait();
					task.wait();
					worldState.activated = false;
				});
			}
		},
		[part],
	);

	return (
		<>
			{device === "computer" && (
				<ComputerController
					pv={pv}
					move={move}
					zoom={zoom}
					rotate={rotate}
					jump={jump}
					point={point}
					activate={activate}
				/>
			)}
			{device === "gamepad" && (
				<GamepadController
					pv={pv}
					move={move}
					zoom={zoom}
					rotate={rotate}
					jump={jump}
					point={point}
					activate={activate}
				/>
			)}
			{device === "mobile" && (
				<MobileController
					pv={pv}
					move={move}
					zoom={zoom}
					rotate={rotate}
					jump={jump}
					point={point}
					activate={activate}
				/>
			)}
		</>
	);
}
