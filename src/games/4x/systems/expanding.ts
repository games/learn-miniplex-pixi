import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'
import { Map } from '../views/hexagons/Map'

export function expanding(world: World<Entity>) {
    const maps = world.with('mapData')
    const empires = world.with('empire', 'region')
    const cells = world.with('region')

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
        const occupiedCells = []
        for (const entity of empires) {
            const { empire, region } = entity
            const neighbors = mapView.neighbors(region.x, region.y)
            for (const neighbor of neighbors) {
                if (!neighbor.region.empire && !neighbor.region.isBlocked) {
                    neighbor.region.empire = empire
                    empire.regions.push(neighbor.region)
                    occupiedCells.push(neighbor.region)
                } else if (
                    neighbor.region.empire &&
                    neighbor.region.empire !== empire
                ) {
                    empire.borderEmpires.add(neighbor.region.empire)
                    region.isBattlefront = true
                    neighbor.region.isBattlefront = true
                }
            }
        }

        for (const region of occupiedCells) {
            if (!region.empire) {
                return
            }
            const occupied = cells.where(
                (element) =>
                    element.region.x === region.x && element.region.y === region.y
            )
            for (const entity of occupied) {
                world.addComponent(entity, 'empire', region.empire)
            }
        }

        mapView.refresh()
    }
}
