export type Hex = {
    x: number
    y: number
    empire?: Empire
    color: number
    savedColor: number
    isClustered: boolean
}

export type Empire = {
    name: string
    capital: string
    color: string
    expanding: boolean
    economy: number
    stability: number
    warTargets: string[]
    peaceDeals: string[]
    borderEmpires: string[]
    borderCount: number
    age: number
}

export type MapData = {
    hexes: Hex[]
    empires: Empire[]
    width: number
    height: number
}

// export class Map {
//     public readonly hexes: Hex[]

//     constructor(
//         public readonly width: number,
//         public readonly height: number
//     ) {
//         this.hexes = []
//     }

//     add(hex: Hex) {
//         const index = hex.x + hex.y * this.width
//         this.hexes[index] = hex
//     }

//     randomTile(): Hex | undefined {
//         return this.hexes[Math.floor(Math.random() * this.hexes.length)]
//     }
// }
