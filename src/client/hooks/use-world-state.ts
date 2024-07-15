import { useContext } from "@rbxts/react";
import { WorldContext, WorldState } from "client/providers/world-provider";

export function useWorldState() {
	return useContext(WorldContext).worldState ?? new WorldState();
}
