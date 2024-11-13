import { World } from 'miniplex'
import { Entity } from '../entity'
import { Application } from 'pixi.js'
import { BiomeColorsTest } from '../views/BiomeColorsTest'

export const test = (world: World<Entity>, application: Application) => {
    return async () => {
        const t = new BiomeColorsTest(application)
        t.position.set(100, 100)
        world.add({
            view: t,
        })
    }
}
