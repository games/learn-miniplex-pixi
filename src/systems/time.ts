import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'
import { GameTime } from '../views/GameTime'

// 1 day in game is 1000ms
const dayInGame = 1000

export function time(world: World<Entity>) {
    const times = world.with('time')
    let lastUpdate = 0
    let totalDays = 0

    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < dayInGame) {
            return
        }
        lastUpdate = ticker.lastTime
        
        const [entity] = times
        const { time } = entity

        totalDays = time.year * 360 + time.month * 30 + time.day + 1
        
        time.year = Math.floor(totalDays / 360)
        time.month = Math.floor((totalDays % 360) / 30)
        time.day = Math.floor((totalDays % 360) % 30)

        const { view } = entity
        if (view instanceof GameTime) {
            view.update(time)
        }
    }
}
