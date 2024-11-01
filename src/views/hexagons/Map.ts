import { Container } from 'pixi.js'
import { MapData } from '../../game/objects'
import { Region } from './Region'
import {
    defineHex,
    Direction,
    Grid,
    Hex,
    HexCoordinates,
    hexToPoint,
    OffsetCoordinates,
    rectangle,
} from 'honeycomb-grid'
import { isNumber } from 'fp-ts/lib/number'

type MapOptions = {
    data: MapData
    size: number
}

export class Map extends Container {
    private readonly regions: Record<string, Region> = {}
    private readonly grid: Grid<Hex>

    constructor({ data, size }: MapOptions) {
        super()

        const grid = new Grid(
            defineHex({ dimensions: size }),
            rectangle({ width: data.width, height: data.height })
        )
        grid.forEach((hex) => {
            const index = hex.row * data.width + hex.col
            const cell = data.cells[index]
            const { x, y } = hexToPoint(hex)
            const region = new Region({ size, cell })
            region.position.set(x, y)
            this.addChild(region)
            this.regions[regionKey(hex)] = region
        })
        this.grid = grid

        this.eventMode = 'static'
        this.interactiveChildren = false
        const hitArea = this.getLocalBounds().rectangle
        this.hitArea = hitArea

        this.onmousemove = (e) => {
            const position = this.toLocal(e.global)
            const hex = grid.pointToHex(position)
            const region = this.regions[`${hex.col},${hex.row}`]
            if (region) {
                this.children.forEach((region) => {
                    region.alpha = 1
                })
                region.alpha = 0.5
            }
        }

        this.onpointerup = (e) => {
            const position = this.toLocal(e.global)
            const hex = grid.pointToHex(position)
            const region = this.regions[regionKey(hex)]
            if (region) {
                const hexes = neighbors<Hex>(grid, {
                    col: hex.col,
                    row: hex.row,
                })
                for (const neighbor of hexes) {
                    const region = this.regions[regionKey(neighbor)]
                    if (region) {
                        region.alpha = 0.5
                    }
                }
            }
        }
    }

    neighbors(col: number, row: number) {
        const hexes = neighbors(this.grid, { col, row })
        return hexes
            .map((hex) => this.regions[regionKey(hex)])
            .filter((x) => x !== undefined)
    }

    render() {
        Object.values(this.regions).forEach((region) => {
            region.render()
        })
    }
}

function regionKey(coordinate: OffsetCoordinates) {
    return `${coordinate.col},${coordinate.row}`
}

function neighbors<T extends Hex>(grid: Grid<T>, coordinates: HexCoordinates) {
    return Object.values(Direction)
        .filter((x) => isNumber(x))
        .map((direction) => {
            return grid.neighborOf(coordinates, direction)
        })
}
