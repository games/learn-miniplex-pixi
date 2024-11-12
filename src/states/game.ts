import { World } from 'miniplex'
import { Entity } from '../entity'
import { Application, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import * as MapData from '../game/map'
import { EmpireStatsPanel } from '../views/EmpireStatsPanel'
import { GameTime } from '../views/GameTime'
import { Map } from '../views/hexagons/Map'
import * as HUD from '../views/HUD'

export const game = (world: World<Entity>, application: Application) => {
    return async () => {
        const viewport = new Viewport({
            passiveWheel: false,
            events: application.renderer.events,
        })
        viewport.drag().pinch().wheel().decelerate()
        const stage = world.add({ view: viewport })
        const map = world.add({ view: new Container(), parent: stage })
        const hud = world.add({ view: new Container() })

        const empireStatsView = new EmpireStatsPanel()
        empireStatsView.visible = false
        const empireStats = world.add({
            view: empireStatsView,
            parent: hud,
        })

        const gameTime = new GameTime()
        gameTime.position.set(20, 10)
        world.add({
            view: gameTime,
            parent: hud,
            time: { year: 218, month: 0, day: 0 },
        })

        const mapData = MapData.create2({
            // seeds: {
            //     terrain: Math.random(),
            //     elevation: Math.random(),
            //     moisture: 3,
            // },
            width: 40,
            height: 40,
            continentRoughness: 0.4,
            displacement: 20000,
            waterLevel: 0.4,
            empires: 5,
        })
        const mapView = new Map({ data: mapData, size: 16 })
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

        HUD.setup()
    }
}
