import { World } from 'miniplex'
import { Entity } from '../entity'
import { EmpireStatsPanel } from '../views/EmpireStatsPanel'

export function empireStats(world: World<Entity>) {
    const panels = world.with('view', 'empireStats')

    return () => {
        const panel = panels.first
        if (!panel) return

        const { empireStats } = panel

        if (!empireStats) {
            panel.view.visible = false
            return
        }

        if (panel.view instanceof EmpireStatsPanel) {
            panel.view.update(empireStats.region)
            panel.view.position.set(
                empireStats.position.x,
                empireStats.position.y
            )
        }
    }
}
