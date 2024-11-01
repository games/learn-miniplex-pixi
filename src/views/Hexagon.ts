import { ColorSource, Container, Graphics, GraphicsContext } from 'pixi.js'

type HexOptions = {
    size: number
    color: ColorSource
}

const caches: Record<string, GraphicsContext> = {}

function drawHexagon(size: number, color: ColorSource): GraphicsContext {
    const radius = size
    const hr = radius / 2
    const height = Math.sqrt(3) * radius
    const hh = height / 2
    const g = new GraphicsContext()
    g.rotate(Math.PI / 6)
    g.poly([-radius, 0, -hr, hh, hr, hh, radius, 0, hr, -hh, -hr, -hh])
    g.fill(color).stroke(0x000000)
    return g
}

export class Hexagon extends Container {
    constructor(options: HexOptions) {
        super()
        const k = options.color.toString()
        if (!caches[k]) {
            caches[k] = drawHexagon(options.size, options.color)
        }
        const g = new Graphics(caches[k])
        this.addChild(g)
    }
}
