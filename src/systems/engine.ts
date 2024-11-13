import { Bucket, World } from 'miniplex'
import { Application, ApplicationOptions, Container, Ticker } from 'pixi.js'
import { renderingSystem } from './rendering'
import { type StateManager, stateManager } from './state'

export type RenderableNode = {
    view: Container
}

export type Node = {
    parent?: Node
    engine?: {
        application: Application
        state: StateManager
    }
} & Partial<RenderableNode>

export type System = (ticker: Ticker) => void

type EngineOptions = {} & Partial<ApplicationOptions>

export async function start<TEntity extends Node>(
    options: EngineOptions,
    init: (world: World<TEntity>, systems: Bucket<System>) => Promise<void>
) {
    const application = new Application()
    await application.init(options)
    document.body.appendChild(application.canvas)

    const world = new World<TEntity>()
    const systems = new Bucket<System>()
    const rendering = renderingSystem(world, application)

    const engine = {
        application,
        state: stateManager(),
    }
    world.add({ engine } as TEntity)

    await init(world, systems)

    application.ticker.add((ticker) => {
        // TODO: consider to run in parallel?
        for (const system of systems) {
            system(ticker)
        }

        // rendering system always run after all other systems
        rendering()
    })
}
