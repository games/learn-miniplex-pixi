type ColorSource = number | string | number[]

export type Cell = {
    x: number
    y: number
    empire?: Empire
    color: ColorSource
    savedColor: number
    isClustered: boolean
    isBlocked: boolean
    isBattlefront: boolean
    isAtWar: boolean
}

type Capital = {
    x: number
    y: number
}

export type Empire = {
    name: string
    capital: Capital
    color: ColorSource
    economy: number
    stability: number

    borderEmpires: Set<Empire>
    age: number

    regions: Cell[]
    wars: WarDeclaration[]
}

export type WarDeclaration = {
    attacker: Empire
    defender: Empire
    battlefield: Cell
    startedAt: number
}

export type MapData = {
    cells: Cell[]
    empires: Empire[]
    width: number
    height: number
}
