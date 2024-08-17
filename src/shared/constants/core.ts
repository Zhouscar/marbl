import { Entity } from "@rbxts/jecs";
import { Players, RunService } from "@rbxts/services";

export const USER_ID = Players.LocalPlayer ? Players.LocalPlayer.UserId : 0;
export const USER_NAME = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";

export const IS_CLIENT = RunService.IsClient();
export const IS_SERVER = RunService.IsServer();
export const IS_STUDIO = RunService.IsStudio();

export const E_ATTRIBUTE = IS_SERVER ? "serverE" : IS_CLIENT ? "clientE" : "unknownE";

export const LAST_E = (math.pow(2, 40) - 1) as Entity;

export const CASTER_ATTACHMENT_NAME = "CASTER_ATTACHMENT";
