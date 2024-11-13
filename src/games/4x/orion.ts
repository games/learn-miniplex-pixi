type Actor = {
    name:
        | 'Humans'
        | 'Bulrathi'
        | 'Silicoids'
        | 'Alkari'
        | 'Darloks'
        | 'Klackons'
        | 'Meklar'
        | 'Mrrshan'
        | 'Sakkra'
        | 'Psilon'
    homeworld: string
    energy: number
    ai: boolean
}

type Vector = {
    x: number
    y: number
}

type Planet = {
    name: string
    population: number
    resources: number
    owner?: string
    fleet?: Ship[]
    location: Vector
}

type Ship = {
    name: string
    speed: number
    firepower: number
    defense: number
    owner: string
    planet: string
    location?: Vector
}

type Terrain = ''

type Map = {
    width: number
    height: number
    terrains: Terrain[]
}

type GameState = {
    currentActor: number
    actors: Actor[]
    planets: Planet[]
    ships: Ship[]
    map: Map
}

const init = (): GameState => {
    const map = {
        width: 10,
        height: 10,
        terrains: [],
    }
    return {
        map,
        currentActor: 0,
        actors: [
            { name: 'Humans', homeworld: 'Earth', ai: false, energy: 4 },
            { name: 'Bulrathi', homeworld: 'Ursa', ai: true, energy: 4 },
            { name: 'Silicoids', homeworld: 'Cryslon', ai: true, energy: 4 },
        ],
        planets: [
            {
                name: 'Earth',
                population: 100,
                resources: 100,
                owner: 'Humans',
                location: { x: 0, y: 0 },
            },
            {
                name: 'Mars',
                population: 0,
                resources: 500,
                owner: 'Bulrathi',
                location: { x: 1, y: 0 },
            },
            {
                name: 'Venus',
                population: 0,
                resources: 1000,
                owner: 'Silicoids',
                location: { x: 0, y: 1 },
            },
            {
                name: 'Jupiter',
                population: 0,
                resources: 2000,
                location: { x: 1, y: 1 },
            },
            {
                name: 'Saturn',
                population: 0,
                resources: 3000,
                location: { x: 2, y: 1 },
            },
            {
                name: 'Uranus',
                population: 0,
                resources: 4000,
                location: { x: 3, y: 1 },
            },
            {
                name: 'Neptune',
                population: 0,
                resources: 5000,
                location: { x: 4, y: 1 },
            },
            {
                name: 'Pluto',
                population: 0,
                resources: 6000,
                location: { x: 5, y: 1 },
            },
        ],
        ships: [
            {
                name: 'Scout',
                speed: 10,
                firepower: 1,
                defense: 1,
                owner: 'Humans',
                planet: 'Earth',
            },
            {
                name: 'Scout',
                speed: 10,
                firepower: 1,
                defense: 1,
                owner: 'Bulrathi',
                planet: 'Mars',
            },
            {
                name: 'Scout',
                speed: 10,
                firepower: 1,
                defense: 1,
                owner: 'Silicoids',
                planet: 'Venus',
            },
        ],
    }
}

// "eXplore, eXpand, eXploit, eXterminate"

// Explore means players send scouts across a map to reveal surrounding territories.
const explore = (state: GameState) => {
    const actor = state.actors[state.currentActor]
    actor.energy -= 1
    console.log('explore', actor)
    return state
}

// Expand means players claim new territory by creating new settlements, or sometimes by extending the influence of existing settlements.
const expand = (state: GameState) => {
    const actor = state.actors[state.currentActor]
    actor.energy -= 1
    console.log('expand', actor)
    return state
}

// Exploit means players gather and use resources in areas they control, and improve the efficiency of that usage.
const exploit = (state: GameState) => {
    const actor = state.actors[state.currentActor]
    actor.energy -= 1
    console.log('exploit', actor)
    return state
}

// Exterminate means attacking and eliminating rival players. Since in some games all territory is eventually claimed,
// eliminating a rival's presence may be the only way to achieve further expansion.
const exterminate = (state: GameState) => {
    const actor = state.actors[state.currentActor]
    actor.energy -= 1
    console.log('exterminate', actor)
    return state
}

type Action = (state: GameState) => GameState

const actions: Record<string, Action> = {
    '1': explore,
    '2': expand,
    '3': exploit,
    '4': exterminate,
}

const delta = 16.6

let state = init()

let action: Action | undefined

const runTurn = () => {
    const actor = state.actors[state.currentActor]
    if (actor.energy <= 0) {
        actor.energy = 4
        return true
    }
    if (actor.ai) {
        state = Object.values(actions).reduce((s, f) => f(s), state)
        return true
    } else if (action) {
        state = action(state)
        action = undefined
        return actor.energy <= 0
    } else {
        const input = prompt(
            'Enter action: 1: explore, 2: expand, 3: exploit, or 4: exterminate'
        )
        if (input) {
            action = actions[input]
        }
        return false
    }
}

const loop = () => {
    while (runTurn()) {
        state.currentActor = (state.currentActor + 1) % state.actors.length
    }
}

setInterval(loop, delta)
