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

## TODO

Main goal is to get the game playable, make at least one gun, movement controls and one enemy.

And something unique about the game.

- [x] Init reflex, jecs, react
- [x] Replication
- [x] Test Replication
- [x] Replication for pairs
- [x] Test Replcation for pairs
- [x] Change Tracker for pairs
- [x] Test Change Tracker for pairs
- [x] Setup tags
- [ ] Test Setup tags

- [ ] Basic components like, remove missing models, update transforms, and update id attribute