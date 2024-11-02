type ColorSource = number | string | number[]

export type Biome =
    | 'ocean'
    | 'water'
    | 'sand'
    | 'grass'
    | 'forest'
    | 'rock'
    | 'snow'

export type Terrain = { biome: Biome; elevation: number; moisture: number }

export type Region = {
    x: number
    y: number
    empire?: Empire
    terrain: Terrain
    isClustered: boolean
    isBlocked: boolean
    isBattlefront: boolean
    isAtWar: boolean
}

type Capital = {}

export type Empire = {
    name: string
    capital: Capital
    color: ColorSource
    economy: number
    stability: number

    borderEmpires: Set<Empire>
    age: number

    regions: Region[]
    wars: WarDeclaration[]
}

export type WarDeclaration = {
    attacker: Empire
    defender: Empire
    battlefield: Region
    startedAt: number
}

export type MapData = {
    regions: Region[]
    empires: Empire[]
    width: number
    height: number
}
