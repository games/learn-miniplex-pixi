import { Ticker } from 'pixi.js'
import { System } from './engine'

export function chained(systems: System[]) {
    return (ticker: Ticker) => {
        for (const system of systems) {
            system(ticker)
        }
    }
}
