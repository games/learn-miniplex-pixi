import { Container } from 'pixi.js'
import { MapData } from '../game/objects'
import { Hexagon } from './Hexagon'
import { Empire } from './Empire'

type MapOptions = {
    data: MapData
    size: number
}

export class Map extends Container {
    constructor({ data, size }: MapOptions) {
        super()

        const width = size * 2
        for (let i = 0; i < data.cells.length; i++) {
            const cell = data.cells[i]
            const row = cell.y
            const hexagon = new Hexagon({ size, color: cell.color })
            // hexagon.position.set(
            //     Math.floor((cell.x * width + (row % 2) * size) * 1.5),
            //     Math.floor(cell.y * size * 0.866)
            // )
            hexagon.position.set(
                cell.x,
                cell.y
            )
            this.addChild(hexagon)

            if (cell.empire) {
                const empire = new Empire({
                    color: cell.empire.color,
                    size: size / 2,
                })
                hexagon.addChild(empire)
            }
        }

        // for (const hex of data.cells) {
        //     const hexagon = new Hexagon({ size, color: hex.color })
        //     hexagon.position.set(hex.x * size * 1.5, hex.y * size * 0.866)
        //     this.addChild(hexagon)

        //     if (hex.empire) {
        //         const empire = new Empire({
        //             color: hex.empire.color,
        //             size: size / 2,
        //         })
        //         hexagon.addChild(empire)
        //     }
        // }
    }
}
