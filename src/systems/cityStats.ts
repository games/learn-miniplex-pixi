import { World } from "miniplex";
import { Entity } from "./engine";
import { CityStatsPanel } from "../views/CityStatsPanel";

export function cityStats(world: World<Entity>) {
  const panels = world
    .with("view", "tag")
    .where((x) => x.tag === "cityStatsPanel");

  return () => {
    const panel = panels.first;
    if (!panel) return;

    const { cityStats } = panel;

    if (!cityStats) {
      panel.view.visible = false;
      return;
    }

    if (panel.view instanceof CityStatsPanel) {
      panel.view.visible = true;
      panel.view.update(cityStats.city);
      panel.view.position.set(cityStats.position.x, cityStats.position.y);
    }
  };
}
