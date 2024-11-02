import { createNoise2D } from 'simplex-noise'
import { Region, Empire, MapData } from './objects'
import { findFirst } from 'fp-ts/lib/Array'
import Alea from 'alea'
import { Map } from 'rot-js'
import { shuffle } from '../utils/shuffle'
import { nameColors } from '../utils/colors'

function randomPick<T>(items: T[]): T | undefined {
    return items[Math.floor(Math.random() * items.length)]
}

export function hexAt(map: MapData, x: number, y: number) {
    return findFirst<Region>((hex) => hex.x === x && hex.y === y)(map.regions)
}

type CreateOptions = {
    seed?: number
    width: number
    height: number
    continentRoughness: number
    displacement: number
    waterLevel: number
    empires: number
}

function placeEmpires(count: number, cells: Region[]) {
    const empires: Empire[] = []
    const colors = shuffle(nameColors)()
    for (let i = 0; i < count; i++) {
        const cell = randomPick(cells)
        if (cell && cell.empire === undefined) {
            const empire = {
                name: 'Empire ' + i,
                capital: {},
                color: colors[i],
                economy: 0,
                stability: 0,
                borderEmpires: new Set<Empire>(),
                age: 0,
                regions: [],
                wars: [],
            }
            cell.empire = empire
            empires.push(empire)
        }
    }
    return empires
}

export function create(options: CreateOptions): MapData {
    const { width, height, continentRoughness, displacement, waterLevel } =
        options
    const prng = Alea(options.seed ?? Math.random())
    const noise = createNoise2D(prng)

    const cells: Region[] = []
    const walkable: Region[] = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const nx = x * 0.225 * continentRoughness + displacement
            const ny = y * 0.225 * continentRoughness + displacement
            const n = noise(nx, ny)
            const cell = {
                x,
                y,
                isClustered: false,
                isBlocked: true,
                isBattlefront: false,
                isAtWar: false,
            }
            if (n > (waterLevel - 0.5) * 2) {
                cell.isBlocked = false
                walkable.push(cell)
            }
            cells.push(cell)
        }
    }

    const empires = placeEmpires(options.empires, walkable)

    return { regions: cells, empires, width, height }
}

export function create2(options: CreateOptions): MapData {
    const gen =
        // new Map.Digger(options.width, options.height)
        new Map.Cellular(options.width, options.height, {
            born: [4, 5, 6, 7, 8],
            survive: [2, 3, 4, 5],
        })

    gen.randomize(0.9)

    const cells: Region[] = []
    const walkable: Region[] = []
    const creator = (x: number, y: number, contents: number) => {
        const isBlocked = contents === 1
        const cell = {
            x,
            y,
            isClustered: false,
            isBlocked,
            isBattlefront: false,
            isAtWar: false,
        }
        cells.push(cell)
        if (!isBlocked) {
            walkable.push(cell)
        }
    }

    gen.create(creator)

    const empires = placeEmpires(options.empires, walkable)

    return {
        regions: cells,
        empires,
        width: options.width,
        height: options.height,
    }
}
