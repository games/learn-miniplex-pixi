import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'
import { Map } from '../views/hexagons/Map'
import { Region, Empire } from '../game/objects'
import { randomRange } from 'fp-ts/lib/Random'

export function campaign(world: World<Entity>) {
    const maps = world.with('mapData')
    const empires = world.with('empire', 'region')

    let lastUpdate = 0
    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < 1000) {
            return
        }
        lastUpdate = ticker.lastTime

        const [map] = maps
        const mapView = map.view as Map

        for (const entity of empires) {
            const { empire } = entity
            if (empire.wars.length === 0) {
                continue
            }
            if (empire.borderEmpires.size === 0) {
                continue
            }
            // if the empire economy is bad (< 1000), it will not attack other empires
            if (empire.economy < 1000) {
                continue
            }

            const attackerAllies = allies(mapView, empire, entity.region)

            const cost = 10000
            for (let i = empire.wars.length - 1; i >= 0; i--) {
                const war = empire.wars[i]
                war.attacker.economy -= cost
                war.attacker.stability -= cost
                war.defender.economy -= cost
                war.defender.stability -= cost

                const defenderAllies = allies(
                    mapView,
                    war.defender,
                    war.battlefield
                )

                const isOver = Math.random() > 0.5
                const winner = isOver
                    ? randomRange(0, attackerAllies) >
                      randomRange(0, defenderAllies)
                        ? war.attacker
                        : war.defender
                    : undefined
                if (winner) {
                    winner.regions.push(war.battlefield)
                    war.battlefield.empire = winner
                    war.battlefield.isAtWar = false
                    empire.wars.pop()
                }
            }
        }
    }
}

function allies(mapView: Map, empire: Empire, cell: Region) {
    return mapView
        .neighbors(cell.x, cell.y)
        .filter((cell) => cell.region.empire === empire).length
}
