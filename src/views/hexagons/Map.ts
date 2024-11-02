import { Container } from 'pixi.js'
import { MapData } from '../../game/objects'
import { Cell } from './Cell'
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
import { Signal } from 'typed-signals'

type MapOptions = {
    data: MapData
    size: number
}

export class Map extends Container {
    private readonly cells: Record<string, Cell> = {}
    private readonly grid: Grid<Hex>

    public readonly regionOvered: Signal<(x: Cell) => void> = new Signal()
    public readonly regionOuted: Signal<() => void> = new Signal()

    constructor({ data, size }: MapOptions) {
        super()

        const grid = new Grid(
            defineHex({ dimensions: size }),
            rectangle({ width: data.width, height: data.height })
        )
        grid.forEach((hex) => {
            const index = hex.row * data.width + hex.col
            const region = data.regions[index]
            const { x, y } = hexToPoint(hex)
            const cell = new Cell({
                size,
                region,
            })
            cell.position.set(x, y)
            this.addChild(cell)
            this.cells[cellKey(hex)] = cell
        })
        this.grid = grid

        this.eventMode = 'static'
        this.interactiveChildren = false
        const hitArea = this.getLocalBounds().rectangle
        this.hitArea = hitArea

        this.onmousemove = (e) => {
            const position = this.toLocal(e.global)
            const hex = grid.pointToHex(position)
            const region = this.cells[`${hex.col},${hex.row}`]
            if (region) {
                this.children.forEach((region) => {
                    region.alpha = 1
                })
                region.alpha = 0.5
                this.regionOvered.emit(region)
            } else {
                this.regionOuted.emit()
            }
        }

        this.onpointerup = (e) => {
            const position = this.toLocal(e.global)
            const hex = grid.pointToHex(position)
            const cells = this.cells[cellKey(hex)]
            if (cells) {
                const hexes = neighbors<Hex>(grid, {
                    col: hex.col,
                    row: hex.row,
                })
                for (const neighbor of hexes) {
                    const cell = this.cells[cellKey(neighbor)]
                    if (cell) {
                        cell.alpha = 0.5
                    }
                }
            }
        }
    }

    neighbors(col: number, row: number) {
        const hexes = neighbors(this.grid, { col, row })
        return hexes
            .map((hex) => this.cells[cellKey(hex)])
            .filter((x) => x !== undefined)
    }

    refresh() {
        Object.values(this.cells).forEach((cell) => cell.render())
    }
}

function cellKey(coordinate: OffsetCoordinates) {
    return `${coordinate.col},${coordinate.row}`
}

function neighbors<T extends Hex>(grid: Grid<T>, coordinates: HexCoordinates) {
    return Object.values(Direction)
        .filter((x) => isNumber(x))
        .map((direction) => {
            return grid.neighborOf(coordinates, direction)
        })
}
