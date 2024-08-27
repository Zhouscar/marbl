# marbl

## Problems

### Replicating Pairs

An example would be

```ts
const damaged = pair(DamagedBy, enemyEntity)
```

Not sure how I will tackle this

```ts
const ReplicatedPair = world.component()

const DamagedBy = world.component()
world.add(DamagedBy, ReplicatedPair)

for (const [relation] of world.query(ReplicatedPair)) {
    for (const [e] of world.query(pair(relation, __))) {
    const second = world.target(e, relation)

        doReplication({first: relation, second: second})
    }
}
```

I can also do it with the same Replicated component
However, the replication map has to change

What if say
```ts
const damagedBy = pair(DamagedBy, damageEntity)

doReplication(world.set(victimEntity, damagedBy, 5))
doReplication(world.set(damageEntity, Health, 100))
```
damageEntity is in a pair in replication before it exists on the client
so the damageEntity is created in the client

so when the damageEntity has something to change about it's health
the entity is already there in the client.

### Shared systems
In matter ecs, because there is a `start` function, the systems in the shared directory can be automatically added.

However, since I'm planning to copy everything from the slither game, `index.server.ts` and `index.client.ts` has been the way to run files, and in ReplicatedStorage scripts and local scripts do not run.

I was thinking that I create another directory called "both" or something so that localscript and scripts can be ran.

Or I should actually just revert everything to what it use to be :(

Or use decorators

### Projectile Systems

Some things I'm looking forward projectile system are these things:
- player initiated projectiles
- client sided projectile movement


I'm thinking since a projectile has a very straightforward path (excluding tracked projectiles)
I can make them strictly based on positioners

Honestly, tracked projectiles is just a series of positioners with changed acceleration and I think it's doable, but not now.

Positioners, and a DoNotReplicate component so that it doensn't replicate back.


## TODO

Main goal is to get the game playable, make at least one gun, movement controls and one enemy.

And something unique about the game.
- Use react-motion or something, rowind idk
- Also I should consider about simulation distance once every so often.

- [x] Init reflex, jecs, react
- [x] Replication
- [x] Test Replication
- [x] Replication for pairs
- [x] Test Replcation for pairs
- [x] Change Tracker for pairs
- [x] Test Change Tracker for pairs
- [x] Setup tags
- [x] Test Setup tags
- [x] Basic components like, remove missing models, and update id attribute
- [x] Test it
- [x] Marbl movement
- [x] Marbl spin gadgets

- [x] Projectile spawn
- [x] Projectile shoot
- [x] Projectile lifetime
- [x] Projectile hit

- [x] Marbl health
- [x] Projectile damage

- [x] Prevent memory leak like ServerPV, or ServerE

IDEA: health and energy steal of other enemies along side xp

- [x] Melee_spin spin
- [ ] Melee_spin damage
- [ ] Melee_spin bounce

- [ ] gun cooldown

- [ ] Melee stab

- [ ] Marbl death

- [ ] Enemy (AI, weapon)