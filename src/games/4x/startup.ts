import * as engine from '../../systems/engine'
import { renderingSystem } from '../../systems/rendering'
import { Entity } from './entity'
import { game } from './states/game'
import { loading } from './states/loading'
import { campaign } from './systems/campaign'
import { conquer } from './systems/conquer'
import { economy } from './systems/economy'
import { empireStats } from './systems/empireStats'
import { expanding } from './systems/expanding'

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

        // add systems
        systems.add(economy(world))
        systems.add(expanding(world))
        systems.add(conquer(world))
        systems.add(campaign(world))
        systems.add(empireStats(world))
        systems.add(renderingSystem(world, engine.application))

        await engine.state.enter(loading(world))
        await engine.state.enter(game(world, engine.application))
        // await engine.state.enter(test(world, engine.application))
    })
}
