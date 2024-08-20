import { Entity } from "@rbxts/jecs";

export interface DamageConfig {
	amount: number;
}

export interface DamageContext extends DamageConfig {
	// time: number;
	fromE?: Entity;
	toE: Entity;
}
