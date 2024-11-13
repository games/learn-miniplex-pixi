import { World } from "miniplex"
import { Application, Ticker } from "pixi.js"
import { Entity } from "../entity"

export const input = (world: World<Entity>, application: Application) => {
    const player = world.with('player')

    return (ticker: Ticker) => {
        
    }
}