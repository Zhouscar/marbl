import React from "@rbxts/react";
import { Camera } from "client/components/camera";
import { Controller } from "client/components/controller";
import { World } from "client/components/world";

export function App() {
	return (
		<>
			<World />
			<Controller />
			<Camera />
		</>
	);
}
