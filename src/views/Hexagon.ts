import { Container, Graphics, GraphicsContext } from 'pixi.js'

type HexOptions = {
    size: number
    color: number
}

const caches: Record<number, GraphicsContext> = {}

function drawHexagon(size: number, color: number): GraphicsContext {
    const radius = size
    const height = Math.sqrt(3) * radius
    const g = new GraphicsContext()
        .poly([
            -radius,
            0,
            -radius / 2,
            height / 2,
            radius / 2,
            height / 2,
            radius,
            0,
            radius / 2,
            -height / 2,
            -radius / 2,
            -height / 2,
        ])
        .fill(color)
        .stroke(0x000000)
    return g
}

export class Hexagon extends Container {
    constructor(options: HexOptions) {
        super()

        if (!caches[options.color]) {
            caches[options.color] = drawHexagon(options.size, options.color)
        }
        const g = new Graphics(caches[options.color])
        // g.rotation = Math.PI / 6
        this.addChild(g)
    }
}
