import { Application, Container, type PointData } from 'pixi.js'
import { Region, Empire, MapData } from './game/objects'
import type { StateManager } from './systems/state'

export type EntityTags = 'city' | 'empireStats' | 'map'

export type RenderableEntity = {
    view: Container
}

export type EmpireStatsPanelEntity = {
    empireStats: {
        region: Region
        position: PointData
    }
}

export type EmpireEntity = {
    empire: Empire
}

export type RegionEntity = {
    region: Region
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
    Partial<EmpireStatsPanelEntity> &
    Partial<EmpireEntity> &
    Partial<MapEntity> &
    Partial<RegionEntity>
