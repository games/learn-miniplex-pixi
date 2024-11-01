import { createNoise2D } from 'simplex-noise'
import { Cell, MapData } from './objects'
import { findFirst } from 'fp-ts/lib/Array'
import Alea from 'alea'
import { Map, RNG } from 'rot-js'
import { shuffle } from '../utils/shuffle'
import { nameColors } from '../utils/colors'

function randomPick(hexes: Cell[]): Cell | undefined {
    return hexes[Math.floor(Math.random() * hexes.length)]
}

export function hexAt(map: MapData, x: number, y: number) {
    return findFirst<Cell>((hex) => hex.x === x && hex.y === y)(map.cells)
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

export function create(options: CreateOptions): MapData {
    const { width, height, continentRoughness, displacement, waterLevel } =
        options
    const prng = Alea(options.seed ?? Math.random())
    const noise = createNoise2D(prng)

    const cells: Cell[] = []
    const walkable: Cell[] = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const nx = x * 0.225 * continentRoughness + displacement
            const ny = y * 0.225 * continentRoughness + displacement
            const n = noise(nx, ny)
            const cell = {
                x,
                y,
                color: 0x000000,
                savedColor: 0,
                isClustered: false,
                isBlocked: true,
            }
            if (n > (waterLevel - 0.5) * 2) {
                cell.color = 0xffffff
                cell.isBlocked = false
                walkable.push(cell)
            }
            cells.push(cell)
        }
    }

    const empires = []
    const colors = shuffle(nameColors)()
    for (let i = 0; i < options.empires; i++) {
        const hex = randomPick(walkable)
        if (hex && hex.empire === undefined) {
            const empire = {
                name: 'Empire ' + i,
                capital: hex.x + ',' + hex.y,
                color: colors[i],
                expanding: false,
                economy: 0,
                stability: 0,
                warTargets: [],
                peaceDeals: [],
                borderEmpires: [],
                borderCount: 0,
                age: 0,
                regions: [],
                wars: [],
            }
            hex.empire = empire
            empires.push(empire)
        }
    }

    return { cells: cells, empires, width, height }
}

export function create2(options: CreateOptions): MapData {
    const gen =
        // new Map.Digger(options.width, options.height)
        new Map.Cellular(options.width, options.height, {
            topology: 6,
            born: [4, 5, 6],
            survive: [3, 4, 5, 6],
        })
    // gen.randomize(0.8)

    /* initialize with irregularly random values */
    const w = options.width
    const h = options.height
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const dx = i / w - 0.5
            const dy = j / h - 0.5
            const dist = Math.pow(dx * dx + dy * dy, 0.3)
            if (RNG.getUniform() < dist) {
                gen.set(i, j, 1)
            }
        }
    }

    const cells: Cell[] = []
    const walkable: Cell[] = []
    gen.create((x, y, contents) => {
        const isBlocked = contents === 1
        const color = isBlocked ? '#000000' : '#ffffff'
        const cell = {
            x,
            y,
            color,
            savedColor: 0,
            isClustered: false,
            isBlocked,
        }
        cells.push(cell)
        if (!isBlocked) {
            walkable.push(cell)
        }
    })

    const empires = []
    const colors = shuffle(nameColors)()
    for (let i = 0; i < options.empires; i++) {
        const hex = randomPick(walkable)
        if (hex && hex.empire === undefined) {
            const empire = {
                name: 'Empire ' + i,
                capital: hex.x + ',' + hex.y,
                color: colors[i],
                expanding: false,
                economy: 0,
                stability: 0,
                warTargets: [],
                peaceDeals: [],
                borderEmpires: [],
                borderCount: 0,
                age: 0,
                regions: [],
                wars: [],
            }
            hex.empire = empire
            empires.push(empire)
        }
    }

    return {
        cells: cells,
        empires,
        width: options.width,
        height: options.height,
    }
}
