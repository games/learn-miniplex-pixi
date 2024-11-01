type ColorSource = number | string | number[]

export type Cell = {
    x: number
    y: number
    empire?: Empire
    color: ColorSource
    savedColor: number
    isClustered: boolean
    isBlocked: boolean
}

export type Empire = {
    name: string
    capital: string
    color: ColorSource
    expanding: boolean
    economy: number
    stability: number
    warTargets: string[]
    peaceDeals: string[]
    borderEmpires: string[]
    borderCount: number
    age: number

    regions: Cell[]
    wars: WarDeclaration[]
}

export type WarDeclaration = {
    empireA: Empire
    empireB: Empire

    isRebellion: boolean
    isLiberation: boolean
}

export type MapData = {
    hexes: Cell[]
    empires: Empire[]
    width: number
    height: number
}
