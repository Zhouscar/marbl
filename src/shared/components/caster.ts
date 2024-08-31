import { Entity } from "@rbxts/jecs";
import { world } from "shared/world";

export const CasterCasting = world.component<undefined>();

export const CasterAttachments = world.component<Attachment[]>();

export const CasterPrevPositions = world.component<Map<Attachment, Vector3>>();

export const CasterResultInstances = world.component<Set<Instance>>();

export const CasterResultEntities = world.component<Set<Entity>>();
