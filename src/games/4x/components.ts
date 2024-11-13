export type Resources = {
    food: number
    wood: number
    stone: number
    gold: number
}

export type Units = 'peasant' | 'soldier' | 'archer' | 'knight' | 'catapult'

export type ResourceModifiers = {
    food: number
    wood: number
    stone: number
    gold: number
}

export type Building = {
    name: string
    cost: Resources
    modifiers: ResourceModifiers
}

export type City = {
    name: string
    population: number
    resources: Resources
    buildings: Building[]
}
