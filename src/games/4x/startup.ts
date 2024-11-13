import * as engine from '../../systems/engine'
import { Entity } from './entity'
import { game } from './states/game'
import { loading } from './states/loading'

const options = {
    width: 800,
    height: 600,
    background: '#1099bb',
    antialias: true,
    resizeTo: window,
}

export const startup = () => {
    engine.start<Entity>(options, async (world, _systems) => {
        const [{ engine }] = world.with('engine')

        await engine.state.enter(loading(world))
        await engine.state.enter(game(world, engine.application))
        // await engine.state.enter(test(world, engine.application))
    })
}
