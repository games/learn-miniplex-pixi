import { World } from 'miniplex'
import { Ticker } from 'pixi.js'
import { Entity } from '../entity'

// Cobb-Douglas Production Function
// -------------------------------
// Y = A ⋅ K^α ⋅ L^(1-α)
// -------------------------------
// Where:
// Y is the total production.
// A is the total factor productivity.
// K is the capital.
// L is the labor.
// α is the output elasticity of capital.

// Capital Accumulation
// -------------------------------
// ΔK = s ⋅ Y − δ ⋅ K
// -------------------------------
// Where:
// s is the savings rate.
// δ is the depreciation rate of capital.
// n is the population growth rate.
// g is the technological progress rate.

const alpha = 0.3
const A = 1
const s = 0.2
const delta = 0.1
const n = 0.0000001
const g = 0.000000

function cobbDouglas(capital: number, labor: number) {
    return A * capital ** alpha * labor ** (1 - alpha)
}

// Simulating capital, labor, productivity, and production dynamics over time
function capitalOverTime(capital: number, labor: number, technology: number) {
    const Y = cobbDouglas(capital, labor)
    const K = capital + s * Y - (delta + n + g) * capital
    const L = labor * (1 + n)
    const A = technology * (1 + g)
    return {
        capital: K,
        labor: L,
        technology: A,
        production: Y,
    }
}

export function economy(world: World<Entity>) {
    const entities = world.with('empire')
    let lastUpdate = 0

    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < 1000) {
            return
        }
        const delta = ticker.lastTime - lastUpdate
        lastUpdate = ticker.lastTime
        for (const { empire } of entities) {
            const labors =
                empire.regions.filter((x) => !x.isAtWar).length //+ empire.labors
            const economy = capitalOverTime(
                empire.economy,
                labors,
                empire.technology
            )

            // Each region at war costs 10% economy
            const expenses =
                empire.regions.filter((x) => x.isAtWar).length * 0.1

            empire.economy = Math.round(economy.capital * (1 - expenses))
            empire.technology = Math.ceil(economy.technology)
            empire.labors = Math.round(economy.labor)
        }
    }
}
