import { PointData } from 'pixi.js'
import { Node } from '../../../systems/engine'

type Recoverable = {
    current: number
    max: number
}

type Condition = { turnRemaining: number; intensity: number } & (
    | { name: 'poisoned' }
    | { name: 'burned' }
    | { name: 'frozen' }
)

type Attributes = {}

export type Actor = {
    name: string
    health: Recoverable

    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number

    energy: Recoverable
    conditions: Condition[]
    attributes: Attributes[]
}

export type Entity = Node & { location?: PointData } & {
    player?: Actor
} & {
    npc?: Actor
}
