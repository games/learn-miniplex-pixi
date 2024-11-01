import { Container } from 'pixi.js'
import { MapData } from '../game/objects'
import { Hexagon } from './Hexagon'
import { Empire } from './Empire'

export class Map extends Container {
    constructor(data: MapData) {
        super()

        const size = 20
        for (const hex of data.hexes) {
            const hexagon = new Hexagon({ size, color: hex.color })
            hexagon.position.set(hex.x * size * 1.5, hex.y * size * 0.9)
            this.addChild(hexagon)

            if (hex.empire) {
                const empire = new Empire({ color: hex.empire.color })
                hexagon.addChild(empire)
            }
        }
    }
}
