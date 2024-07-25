import { Players, RunService } from "@rbxts/services";

export const USER_ID = Players.LocalPlayer ? Players.LocalPlayer.UserId : 0;
export const USER_NAME = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";

export const E_ATTRIBUTE = RunService.IsServer() ? "serverE" : RunService.IsClient() ? "clientE" : "unknownE";
