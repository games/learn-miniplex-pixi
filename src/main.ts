import { Assets, Container, Text } from 'pixi.js'
import { World } from 'miniplex'
import * as engine from './systems/engine'
import './style.css'
import { EmpireStatsPanel } from './views/EmpireStatsPanel'
import * as MapData from './game/map'
import { Entity } from './entity'
import { Map } from './views/hexagons/Map'
import { GameTime } from './views/GameTime'

const loading = (world: World<Entity>) => async () => {
    const progress = new Text({
        text: 'Loading...',
        style: { fill: 0xffffff },
    })

    const entity = world.add({ view: progress })

    // Assets.add({
    //     alias: 'bunny',
    //     src: 'https://pixijs.com/assets/bunny.png',
    // })

    // await Assets.load('bunny', (x) => {
    //     progress.text = `Loading... ${(x * 100).toFixed(1)}%`
    // })

    return async () => {
        world.remove(entity)
    }
}

const game = (world: World<Entity>) => {
    return async () => {
        const stage = world.add({ view: new Container() })
        const map = world.add({ view: new Container(), parent: stage })
        const hud = world.add({ view: new Container(), parent: stage })

        const empireStatsView = new EmpireStatsPanel()
        empireStatsView.visible = false
        const empireStats = world.add({
            view: empireStatsView,
            parent: hud,
        })

        const gameTime = new GameTime()
        gameTime.position.set(20, 10)
        world.add({ view: gameTime, time: { year: 218, month: 0, day: 0 } })

        const mapData = MapData.create2({
            seed: 2,
            width: 40,
            height: 40,
            continentRoughness: 0.4,
            displacement: 20000,
            waterLevel: 0.4,
            empires: 10,
        })
        const mapView = new Map({ data: mapData, size: 15 })
        mapView.position.set(20, 50)
        mapView.regionOvered.connect((cell) => {
            // FIXME: this is a hack to update the empireStats component
            world.removeComponent(empireStats, 'empireStats')
            world.addComponent(empireStats, 'empireStats', {
                region: cell.region,
                position: {
                    x: cell.position.x + mapView.x + 10,
                    y: cell.position.y + mapView.y + 10,
                },
            })
        })
        mapView.regionOuted.connect(() => {
            world.removeComponent(empireStats, 'empireStats')
        })
        const mapEntity = world.add({
            view: mapView,
            parent: map,
            mapData,
        })
        for (const region of mapData.regions) {
            if (region.empire) {
                world.add({
                    empire: region.empire,
                    region: region,
                    parent: mapEntity,
                })
            } else {
                world.add({
                    region: region,
                    parent: mapEntity,
                })
            }
        }
    }
}

engine.start(async (world, _systems) => {
    const [{ engine }] = world.with('engine')

    await engine.state.enter(loading(world))
    await engine.state.enter(game(world))
})
