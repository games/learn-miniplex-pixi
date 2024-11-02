import { ColorSource, Container, Graphics, GraphicsContext } from 'pixi.js'
import { Region } from '../../game/objects'
import { Empire } from '../Empire'

type CellOptions = {
    size: number
    region: Region
}

const caches: Record<string, GraphicsContext> = {}

function regionColor(region: Region) {
    switch (region.terrain.biome) {
        // case 'ocean':
        //     return 0x0000ff
        case 'water':
            return 0x7dcfff
        case 'sand':
            return 0xf5dfb0
        case 'grass':
            return 0x5ce665
        case 'forest':
            return 0x008000
        case 'rock':
            return 0x808080
        case 'snow':
            return 0xffffff
        default:
            return 0x000000
    }
}

function drawHexagon(
    size: number,
    color: ColorSource,
    border: boolean
): GraphicsContext {
    const radius = size
    const hr = radius / 2
    const height = Math.sqrt(3) * radius
    const hh = height / 2
    const g = new GraphicsContext()
    g.rotate(Math.PI / 6)
    g.poly([-radius, 0, -hr, hh, hr, hh, radius, 0, hr, -hh, -hr, -hh])
    g.fill(color)
    if (border) {
        g.stroke(0x000000)
    }
    return g
}

export class Cell extends Container {
    constructor(private readonly options: CellOptions) {
        super()
        this.render()
    }

    render() {
        this.removeChildren()
        const color = regionColor(this.options.region)
        const k = color.toString()
        if (!caches[k]) {
            caches[k] = drawHexagon(
                this.options.size,
                color,
                this.options.region.terrain.biome !== 'water'
            )
        }
        const g = new Graphics(caches[k])
        this.addChild(g)

        if (this.options.region.isAtWar) {
            g.tint = 0xff0000
        }

        if (this.options.region.empire) {
            const empire = new Empire({
                color: this.options.region.empire.color,
                size: this.options.size / 2,
            })
            this.addChild(empire)
        }
    }

    get region() {
        return this.options.region
    }
}
