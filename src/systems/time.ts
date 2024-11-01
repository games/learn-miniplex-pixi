import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'

// 1 day in game is 1000ms
const dayInGame = 1000

export function time(world: World<Entity>) {
    const empires = world.with('empire')
    let lastUpdate = 0

    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < dayInGame) {
            return
        }
        lastUpdate = ticker.lastTime

        for (const entity of empires) {
            const { empire } = entity
            empire.age++
        }
    }
}
