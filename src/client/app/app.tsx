import React from "@rbxts/react";
import { Camera } from "client/components/camera";
import { Controller } from "client/components/controller";
import { Gadgets } from "client/components/gadgets";
import { Projectiles } from "client/components/projectiles";
import { World } from "client/components/world";

print("hi");
export function App() {
	return (
		<>
			<World />
			<Controller />
			<Camera />
			<Gadgets />
			<Projectiles />
		</>
	);
}
