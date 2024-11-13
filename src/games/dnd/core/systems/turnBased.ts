import { World } from 'miniplex'
import { Actor, Entity } from '../entity'
import { Ticker } from 'pixi.js'

export const turnBased = (world: World<Entity>) => {
    const npcs = world.with('npc')
    const players = world.with('player')
    const actors: Actor[] = []

    npcs.onEntityAdded.subscribe((entity) => {
        actors.push(entity.npc)
    })
    npcs.onEntityRemoved.subscribe((entity) => {
        actors.splice(actors.indexOf(entity.npc), 1)
    })
    players.onEntityAdded.subscribe((entity) => {
        actors.push(entity.player)
    })
    players.onEntityRemoved.subscribe((entity) => {
        actors.splice(actors.indexOf(entity.player), 1)
    })

    let currentActor = 0

    const advance = () => {
        currentActor = (currentActor + 1) % actors.length
    }

    const runTurn = () => {
        const actor = actors[currentActor]
        if (actor.energy.current <= 0) {
            actor.energy.current = actor.energy.max
            return true
        }
        if (actor === players.first?.player) {
            // TODO: get action from player's behavior
            return false
        } else {
            actor.energy.current -= 1
            return true
        }
    }

    return (_ticker: Ticker) => {
        if (actors.length === 0) {
            return
        }
        if (currentActor >= actors.length) {
            currentActor = 0
        }
        while (runTurn()) {
            advance()
        }
    }
}
