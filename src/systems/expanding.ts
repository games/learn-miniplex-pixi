import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'
import { Map } from '../views/hexagons/Map'

export function expanding(world: World<Entity>) {
    const maps = world.with('mapData')
    const empires = world.with('empire', 'mapCell')
    const cells = world.with('mapCell')

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
            const { empire, mapCell } = entity
            const neighbors = mapView.neighbors(mapCell.x, mapCell.y)
            for (const neighbor of neighbors) {
                if (!neighbor.cell.empire && !neighbor.cell.isBlocked) {
                    neighbor.cell.empire = empire
                    empire.regions.push(neighbor.cell)
                    occupiedCells.push(neighbor.cell)
                } else if (
                    neighbor.cell.empire &&
                    neighbor.cell.empire !== empire
                ) {
                    empire.borderEmpires.add(neighbor.cell.empire)
                    mapCell.isBattlefront = true
                    neighbor.cell.isBattlefront = true
                }
            }
        }

        for (const cell of occupiedCells) {
            if (!cell.empire) {
                return
            }
            const occupied = cells.where(
                (element) =>
                    element.mapCell.x === cell.x && element.mapCell.y === cell.y
            )
            for (const entity of occupied) {
                world.addComponent(entity, 'empire', cell.empire)
            }
        }

        mapView.refresh()
    }
}
