import { Container } from 'pixi.js'
import { MapData } from '../game/objects'
import { Hexagon } from './Hexagon'
import { Empire } from './Empire'
import { defineHex, Grid, hexToPoint, rectangle } from 'honeycomb-grid'

type MapOptions = {
    data: MapData
    size: number
}

export class HexMap extends Container {
    constructor({ data, size }: MapOptions) {
        super()

        const grid = new Grid(
            defineHex({ dimensions: size }),
            rectangle({ width: data.width, height: data.height })
        )
        grid.forEach((hex) => {
            const cell = data.cells[hex.col * data.width + hex.row]
            const { x, y } = hexToPoint(hex)
            const hexagon = new Hexagon({ size, color: cell.color })
            hexagon.position.set(x, y)
            this.addChild(hexagon)
            if (cell.empire) {
                const empire = new Empire({
                    color: cell.empire.color,
                    size: size / 2,
                })
                hexagon.addChild(empire)
            }
        })
    }
}
