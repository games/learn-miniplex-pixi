import { Application, Container, type PointData } from 'pixi.js'
import { City } from './components'
import { Empire, MapData } from './game/objects'
import type { StateManager } from './systems/state'

export type EntityTags = 'city' | 'cityStatsPanel' | 'map'

export type RenderableEntity = {
    view: Container
}

export type CityEntity = {
    city: City
}

export type CityStatsPanelEntity = {
    cityStats: {
        city: City
        position: PointData
    }
}

export type EmpireEntity = {
    empire: Empire
}

export type MapCellEntity = {
    mapCoord: PointData
}

export type MapEntity = {
    mapData: MapData
}

export type GameTimeEntity = {
    time: {
        year: number
        month: number
        day: number
    }
}

export type Entity = {
    parent?: Entity
    engine?: {
        application: Application
        state: StateManager
    }
    tag?: EntityTags
} & Partial<RenderableEntity> &
    Partial<GameTimeEntity> &
    Partial<CityEntity> &
    Partial<CityStatsPanelEntity> &
    Partial<EmpireEntity> &
    Partial<MapEntity> &
    Partial<MapCellEntity>
