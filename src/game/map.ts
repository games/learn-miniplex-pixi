import { createNoise2D, NoiseFunction2D } from 'simplex-noise'
import { Region, Empire, MapData, Biome, Terrain } from './objects'
import Alea from 'alea'
import { Map } from 'rot-js'
import { shuffle } from '../utils/shuffle'
import { nameColors } from '../utils/colors'

function randomPick<T>(items: T[]): T | undefined {
    return items[Math.floor(Math.random() * items.length)]
}

type CreateOptions = {
    seed1?: number
    seed2?: number
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

const ocean: Terrain = { biome: 'ocean', elevation: 0, moisture: 1 }

function biome(elevation: number, _moisture: number): Biome {
    if (elevation < 0.1) return 'ocean'
    if (elevation < 0.3) return 'water'
    if (elevation < 0.4) return 'sand'
    if (elevation < 0.7) return 'grass'
    if (elevation < 0.8) return 'forest'
    if (elevation < 0.9) return 'rock'
    return 'snow'
}

// https://www.redblobgames.com/maps/terrain-from-noise/#implementation
function terrain(
    x: number,
    y: number,
    width: number,
    height: number,
    noiseE: NoiseFunction2D,
    noiseM: NoiseFunction2D
) {
    const nx = x / width - 0.5
    const ny = y / height - 0.5
    let e =
        1.0 * noiseE(1 * nx, 1 * ny) +
        0.5 * noiseE(2 * nx, 2 * ny) +
        0.25 * noiseE(4 * nx, 4 * ny) +
        0.13 * noiseE(8 * nx, 8 * ny) +
        0.06 * noiseE(16 * nx, 16 * ny) +
        0.03 * noiseE(32 * nx, 32 * ny)
    e = e / (1.0 + 0.5 + 0.25 + 0.13 + 0.06 + 0.03)
    e = e / 2 + 0.5
    // e = Math.pow(e, 5.0)
    let m =
        1.0 * noiseM(1 * nx, 1 * ny) +
        0.75 * noiseM(2 * nx, 2 * ny) +
        0.33 * noiseM(4 * nx, 4 * ny) +
        0.33 * noiseM(8 * nx, 8 * ny) +
        0.33 * noiseM(16 * nx, 16 * ny) +
        0.5 * noiseM(32 * nx, 32 * ny)
    m = m / (1.0 + 0.75 + 0.33 + 0.33 + 0.33 + 0.5)
    m = m / 2 + 0.5
    return { biome: biome(e, m), elevation: e, moisture: m }
}

export function create(options: CreateOptions): MapData {
    const { width, height, continentRoughness, displacement, waterLevel } =
        options
    const noiseE = createNoise2D(Alea(options.seed1 ?? Math.random()))
    const noiseM = createNoise2D(Alea(options.seed2 ?? Math.random()))

    const regions: Region[] = []
    const walkable: Region[] = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const nx = x * 0.225 * continentRoughness + displacement
            const ny = y * 0.225 * continentRoughness + displacement
            const elevation = noiseE(nx, ny)
            const region = {
                x,
                y,
                terrain: terrain(x, y, width, height, noiseE, noiseM),
                isClustered: false,
                isBlocked: true,
                isBattlefront: false,
                isAtWar: false,
            }
            if (elevation > (waterLevel - 0.5) * 2) {
                region.isBlocked = false
                walkable.push(region)
            }
            regions.push(region)
        }
    }

    const empires = placeEmpires(options.empires, walkable)

    return { regions: regions, empires, width, height }
}

export function create2(options: CreateOptions): MapData {
    const gen =
        // new Map.Digger(options.width, options.height)
        new Map.Cellular(options.width, options.height, {
            born: [4, 5, 6, 7, 8],
            survive: [2, 3, 4, 5],
        })

    gen.randomize(0.9)

    const { width, height } = options
    const noiseE = createNoise2D(Alea(options.seed1 ?? Math.random()))
    const noiseM = createNoise2D(Alea(options.seed2 ?? Math.random()))

    const regions: Region[] = []
    const walkable: Region[] = []
    const create = (x: number, y: number, contents: number) => {
        const isBlocked = contents === 1
        const region = {
            x,
            y,
            terrain: isBlocked
                ? ocean
                : terrain(x, y, width, height, noiseE, noiseM),
            isClustered: false,
            isBlocked,
            isBattlefront: false,
            isAtWar: false,
        }
        regions.push(region)
        if (!isBlocked) {
            walkable.push(region)
        }
    }

    gen.create(create)

    const empires = placeEmpires(options.empires, walkable)

    return {
        regions: regions,
        empires,
        width: options.width,
        height: options.height,
    }
}
