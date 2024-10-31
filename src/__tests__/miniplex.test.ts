import { expect, test } from 'vitest'
import { World } from 'miniplex'

// https://github.com/hmans/miniplex/compare/main...joelmalone:miniplex:add-failing-test

test('removing entity should works', () => {
    type Vector2D = { x: number; y: number }

    type Entity = {
        position: Vector2D
        velocity: Vector2D
        moving?: boolean
    }

    const world = new World<Entity>()
    world.with('position')

    const velocity = world.with('velocity')
    world.with('velocity').onEntityRemoved.subscribe(() => {})

    velocity.onEntityAdded.subscribe((entity) => {
        world.addComponent(entity, 'moving', true)
    })

    velocity.onEntityRemoved.subscribe((entity) => {
        world.removeComponent(entity, 'moving')
    })

    world.add({ position: { x: 0, y: 0 }, velocity: { x: 1, y: 1 } })

    world.clear()

    expect(world.entities).toHaveLength(0)
    expect(world.with('position').entities).toHaveLength(0)
    expect(world.with('velocity').entities).toHaveLength(0)
})
