import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'
import { GameTime } from '../views/GameTime'

// 1 day in game is 1000ms
const dayPerMs = 1000

export function time(world: World<Entity>) {
    const times = world.with('time')
    let totalDays = 0
    let totalMS = 0

    return (ticker: Ticker) => {
        totalMS += ticker.deltaMS
        if (totalMS < dayPerMs) {
            return
        }

        const [entity] = times
        const { time } = entity

        totalDays = time.year * 360 + time.month * 30 + time.day + 1
        totalMS -= dayPerMs

        time.year = Math.floor(totalDays / 360)
        time.month = Math.floor((totalDays % 360) / 30)
        time.day = Math.floor((totalDays % 360) % 30)

        const { view } = entity
        if (view instanceof GameTime) {
            view.update(time)
        }
    }
}
