import { World } from 'miniplex'
import { Ticker } from 'pixi.js'
import { Entity } from '../entity'
import { Map } from '../views/hexagons/Map'

export function conquer(world: World<Entity>) {
    const maps = world.with('mapData')
    const empires = world.with('empire', 'region')

    let lastUpdate = 0
    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < 1000) {
            return
        }
        lastUpdate = ticker.lastTime

        const [map] = maps
        if (!map) {
            throw new Error('No map found')
        }
        const mapView = map.view as Map

        // if the empire is at war, it will not attack other empires
        // if the empire economy is ba (< 1000), it will not attack other empires
        // if the empires has peace deals with other empires, it will not attack other empires
        // if the empire has no border empires, it will not attack other empires
        for (const entity of empires.where((x) => x.region.isBattlefront)) {
            const { empire } = entity

            if (empire.economy < 1000) {
                continue
            }
            if (empire.borderEmpires.size === 0) {
                continue
            }

            const neighbors = mapView.neighbors(
                entity.region.x,
                entity.region.y
            )
            const target = neighbors
                .map((neighbor) => neighbor.region)
                .find((region) => region.empire !== empire && region.empire)
            if (!target) {
                entity.region.isBattlefront = false
                continue
            }

            const war = {
                attacker: empire,
                defender: target.empire!,
                battlefield: target,
                startedAt: lastUpdate,
            }
            entity.region.isAtWar = true
            empire.wars.push(war)

            target.isAtWar = true
            target.empire?.wars.push(war)
        }

        mapView.refresh()
    }
}
