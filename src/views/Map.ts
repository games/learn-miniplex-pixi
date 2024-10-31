import { Container } from 'pixi.js'
import { MapData } from '../game/objects'
import { Hexagon } from './Hexagon'

export class Map extends Container {
    constructor(data: MapData) {
        super()

        const size = 20
        for (const hex of data.hexes) {
            const sprite = new Hexagon({ size, color: hex.color })
            sprite.position.set(hex.x * size * 1.5, hex.y * size * 0.9)
            this.addChild(sprite)
        }
    }
}
