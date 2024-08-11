const settings = UserSettings().GetService("UserGameSettings");

export function useSettings() {
	return settings;
}
