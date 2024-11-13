import { type PointData } from 'pixi.js'
import { Region, Empire, MapData } from './objects'
import { Node } from '../../systems/engine'

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

export type Entity = Node &
    Partial<GameTimeEntity> &
    Partial<EmpireStatsPanelEntity> &
    Partial<EmpireEntity> &
    Partial<MapEntity> &
    Partial<RegionEntity>
