import { World } from 'miniplex'
import { Ticker } from 'pixi.js'
import { clamp } from 'rot-js/lib/util'
import { Entity } from '../entity'

export function economy(world: World<Entity>) {
    const entities = world.with('empire')

    let lastUpdate = 0

    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < 1000) {
            return
        }
        lastUpdate = ticker.lastTime
        for (const { empire } of entities) {
            const delta =
                empire.regions.length * 2.5 +
                (empire.regions.length < 20
                    ? 250
                    : (250 +
                          -0.55 * Math.pow(empire.regions.length - 20, 1.3)) /
                      3) /
                    (empire.wars.length + 1)
            empire.economy += delta
            empire.economy = clamp(empire.economy, 0, 500000)
        }
    }
}
