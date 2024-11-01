import { Bucket, World } from 'miniplex'
import { Application, Ticker } from 'pixi.js'
import { renderingSystem } from './rendering'
import { stateManager } from './state'
import { cityStats } from './cityStats'
import { Entity } from '../entity'
import { economy } from './economy'

export type System = (ticker: Ticker) => void

export async function start(
    init: (world: World<Entity>, systems: Bucket<System>) => Promise<void>
) {
    const application = new Application()
    await application.init({ background: '#1099bb', resizeTo: window })
    document.body.appendChild(application.canvas)

    const world = new World<Entity>()
    const systems = new Bucket<System>()
    systems.add(renderingSystem(world, application))
    systems.add(cityStats(world))
    systems.add(economy(world))

    const engine = {
        application,
        state: stateManager(),
    }
    world.add({ engine })

    await init(world, systems)

    application.ticker.add((ticker) => {
        for (const system of systems) {
            system(ticker)
        }
    })
}
