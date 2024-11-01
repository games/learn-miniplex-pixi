import { Assets, Container, Text } from 'pixi.js'
import { World } from 'miniplex'
import * as engine from './systems/engine'
import './style.css'
import { CityStatsPanel } from './views/CityStatsPanel'
import * as MapData from './game/map'
import { Entity } from './entity'
import { HexMap } from './views/HexMap'

const loading = (world: World<Entity>) => async () => {
    const progress = new Text({
        text: 'Loading...',
        style: { fill: 0xffffff },
    })

    const entity = world.add({ view: progress })

    Assets.add({
        alias: 'bunny',
        src: 'https://pixijs.com/assets/bunny.png',
    })

    await Assets.load('bunny', (x) => {
        progress.text = `Loading... ${(x * 100).toFixed(1)}%`
    })

    return async () => {
        world.remove(entity)
    }
}

const game = (world: World<Entity>) => {
    return async () => {
        const stage = world.add({ view: new Container() })
        const map = world.add({ view: new Container(), parent: stage })
        const hud = world.add({ view: new Container(), parent: stage })

        const cityStats = world.add({
            view: new CityStatsPanel(),
            parent: hud,
            tag: 'cityStatsPanel',
        })

        const mapData = MapData.create({
            seed: 2,
            width: 20,
            height: 20,
            continentRoughness: 0.4,
            displacement: 20000,
            waterLevel: 0.4,
            empires: 16,
        })
        const mapView = new HexMap({ data: mapData, size: 20 })
        mapView.position.set(100, 100)
        const mapEntity = world.add({ view: mapView, parent: map })
        for (const empire of mapData.empires) {
            const empireEntity = world.add({ empire, parent: mapEntity })
        }

        // for (let i = 0; i < 3; i++) {
        //     const sprite = Sprite.from('bunny')
        //     sprite.anchor.set(0.5)
        //     sprite.eventMode = 'static'
        //     sprite.position.set(Math.random() * 700, Math.random() * 900)

        //     const entity = prefabs.city.build('City ' + i)
        //     entity.view = sprite
        //     entity.parent = map

        //     sprite.onmouseover = () => {
        //         world.addComponent(cityStats, 'cityStats', {
        //             city: entity.city!,
        //             position: { x: sprite.x, y: sprite.y },
        //         })
        //     }
        //     sprite.onmouseout = () =>
        //         world.removeComponent(cityStats, 'cityStats')

        //     world.add(entity)
        // }
    }
}

engine.start(async (world, _systems) => {
    const [{ engine }] = world.with('engine')

    await engine.state.enter(loading(world))
    await engine.state.enter(game(world))
})
