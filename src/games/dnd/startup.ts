import { World, Bucket } from 'miniplex'
import * as engine from '../../systems/engine'
import { Entity } from './core/entity'
import { turnBased } from './core/systems/turnBased'
import { game } from './game'
import { Ticker } from 'pixi.js'

const options = {
    width: 800,
    height: 600,
    background: '#1099bb',
    antialias: true,
    resizeTo: window,
}

export const startup = () => {
    engine.start<Entity>(options, async (world, systems) => {
        const [{ engine }] = world.with('engine')

        systems.add(turnBased(world))

        await engine.state.enter(game(world, engine.application))
        // await engine.state.enter(test(world, engine.application))
    })
}

export const headless = async () => {
    const world = new World<Entity>()
    const systems = new Bucket<engine.System>()
    systems.add(turnBased(world))

    await game(world, undefined as any)()

    const ticker = new Ticker()
    ticker.add((t) => {
        for (const system of systems) {
            system(t)
        }
    })
    ticker.start()
}
