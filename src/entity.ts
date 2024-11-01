import { Application, Container } from 'pixi.js'
import { City } from './components'
import { Empire } from './game/objects'
import type { StateManager } from './systems/state'

export type EntityTags = 'city' | 'cityStatsPanel'

export type RenderableEntity = {
    view: Container
}

export type CityEntity = {
    city: City
}

export type CityStatsPanelEntity = {
    cityStats: {
        city: City
        position: {
            x: number
            y: number
        }
    }
}

export type EmpireEntity = {
    empire: Empire
}

export type Entity = {
    parent?: Entity
    engine?: {
        application: Application
        state: StateManager
    }
    tag?: EntityTags
} & Partial<RenderableEntity> &
    Partial<CityEntity> &
    Partial<CityStatsPanelEntity> &
    Partial<EmpireEntity>
