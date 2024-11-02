import {
    ColorSource,
    Container,
    GetPixelsOutput,
    Graphics,
    GraphicsContext,
} from 'pixi.js'
import { Region } from '../../game/objects'
import { Empire } from '../Empire'

type CellOptions = {
    size: number
    region: Region
    biomeColors: GetPixelsOutput
}

const caches: Record<string, GraphicsContext> = {}

function regionColor(region: Region) {
    switch (region.terrain.biome) {
        // case 'ocean':
        //     return 0x0000ff
        case 'water':
            return 0x7dcfff
        case 'sand':
            return 0xf5f5f5
        case 'grass':
            return 0xe6e6e6
        case 'forest':
            return 0xe7e7e7
        case 'rock':
            return 0xe8e8e8
        case 'snow':
            return 0xffffff
        default:
            return 0x000000
    }
}

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

export class Cell extends Container {
    constructor(private readonly options: CellOptions) {
        super()
        this.render()
    }

    render() {
        this.removeChildren()

        const cx = Math.floor(
            this.options.region.terrain.moisture *
                this.options.biomeColors.width
        )
        const cy = Math.floor(
            this.options.region.terrain.elevation *
                this.options.biomeColors.height
        )
        const i = (cx * this.options.biomeColors.width + cy) * 4
        //RGBA
        const color = {
            r: this.options.biomeColors.pixels[i],
            g: this.options.biomeColors.pixels[i + 1],
            b: this.options.biomeColors.pixels[i + 2],
            a: this.options.biomeColors.pixels[i + 3],
        }

        //regionColor(this.options.region)
        const k = `${color.r},${color.g},${color.b},${color.a}`
        if (!caches[k]) {
            caches[k] = drawHexagon(this.options.size, color)
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
