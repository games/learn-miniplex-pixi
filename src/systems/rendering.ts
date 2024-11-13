import { World } from 'miniplex'
import { Application } from 'pixi.js'
import { Node } from './engine'

export function renderingSystem<TEntity extends Node>(
    world: World<TEntity>,
    application: Application
) {
    const entities = world.with('view')

    entities.onEntityAdded.subscribe((entity) => {
        if (!entity.view) {
            return
        }
        if (entity.parent?.view) {
            entity.parent.view.addChild(entity.view)
        } else {
            application.stage.addChild(entity.view)
        }
    })

    entities.onEntityRemoved.subscribe((entity) => {
        if (!entity.view) {
            return
        }
        entity.view.parent?.removeChild(entity.view)
    })

    return () => {}
}
