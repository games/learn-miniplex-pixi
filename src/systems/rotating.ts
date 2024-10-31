import { World } from 'miniplex'
import { Entity } from './engine'
import { Ticker } from 'pixi.js'

export function rotatingSystem(world: World<Entity>) {
    const entities = world.with('view', 'rotating')

    return (ticker: Ticker) => {
        for (const entity of entities) {
            entity.view.rotation += entity.rotating.speed * ticker.deltaMS
        }
    }
}
