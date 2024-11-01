import { ColorSource, Container, Graphics, GraphicsContext } from 'pixi.js'
import { Cell } from '../../game/objects'
import { Empire } from '../Empire'

type HexOptions = {
    size: number
    cell: Cell
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

export class Region extends Container {
    constructor(private readonly options: HexOptions) {
        super()
        this.render()
    }

    render() {
        this.removeChildren()

        const k = this.options.cell.color.toString()
        if (!caches[k]) {
            caches[k] = drawHexagon(this.options.size, this.options.cell.color)
        }
        const g = new Graphics(caches[k])
        this.addChild(g)

        if (this.options.cell.isAtWar) {
            g.tint = 0xff0000
        }

        if (this.options.cell.empire) {
            const empire = new Empire({
                color: this.options.cell.empire.color,
                size: this.options.size / 2,
            })
            this.addChild(empire)
        }
    }

    get cell() {
        return this.options.cell
    }
}
