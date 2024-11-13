import { World } from 'miniplex'
import { Actor, Entity } from './core/entity'
import { Application } from 'pixi.js'

export const game = (world: World<Entity>, _application: Application) => {
    return async () => {
        const player: Actor = {
            name: 'Player',
            energy: { current: 10, max: 10 },
            health: { current: 10, max: 10 },
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
            conditions: [],
            attributes: [],
        }
        world.add({ player })

        const npc: Actor = {
            name: 'NPC',
            energy: { current: 10, max: 10 },
            health: { current: 10, max: 10 },
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
            conditions: [],
            attributes: [],
        }
        world.add({ npc })
    }
}
