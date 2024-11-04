import { Bucket, World } from 'miniplex'
import { Application, ApplicationOptions, Ticker } from 'pixi.js'
import { renderingSystem } from './rendering'
import { stateManager } from './state'
import { empireStats } from './empireStats'
import { Entity } from '../entity'
import { time } from './time'
import { economy } from './economy2'
import { expanding } from './expanding'
import { conquer } from './conquer'
import { campaign } from './campaign'

export type System = (ticker: Ticker) => void

type EngineOptions = {} & Partial<ApplicationOptions>

export async function start(
    options: EngineOptions,
    init: (world: World<Entity>, systems: Bucket<System>) => Promise<void>
) {
    const application = new Application()
    await application.init(options)
    document.body.appendChild(application.canvas)

    const world = new World<Entity>()
    const systems = new Bucket<System>()
    systems.add(time(world))
    systems.add(empireStats(world))
    systems.add(economy(world))
    // systems.add(expanding(world))
    // systems.add(conquer(world))
    // systems.add(campaign(world))
    systems.add(renderingSystem(world, application))

    const engine = {
        application,
        state: stateManager(),
    }
    world.add({ engine })

    await init(world, systems)

    application.ticker.add((ticker) => {
        // TODO: consider to run in parallel?
        for (const system of systems) {
            system(ticker)
        }
    })
}
