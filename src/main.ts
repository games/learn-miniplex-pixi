import { Assets, Container, Sprite, Text } from "pixi.js";
import { World } from "miniplex";
import * as engine from "./systems/engine";
import * as prefabs from "./prefabs";
import "./style.css";
import { CityStatsPanel } from "./views/CityStatsPanel";

const loading = (world: World<engine.Entity>) => async () => {
  const progress = new Text({
    text: "Loading...",
    style: { fill: 0xffffff },
  });

  const entity = world.add({ view: progress });

  Assets.add({
    alias: "bunny",
    src: "https://pixijs.com/assets/bunny.png",
  });

  await Assets.load("bunny", (x) => {
    progress.text = `Loading... ${(x * 100).toFixed(1)}%`;
  });

  return async () => {
    world.remove(entity);
  };
};

const game = (world: World<engine.Entity>) => {
  return async () => {
    const stage = world.add({ view: new Container() });
    const map = world.add({ view: new Container(), parent: stage });
    const hud = world.add({ view: new Container(), parent: stage });

    const cityStats = world.add({
      view: new CityStatsPanel(),
      parent: hud,
      tag: "cityStatsPanel",
    });

    for (let i = 0; i < 3; i++) {
      const sprite = Sprite.from("bunny");
      sprite.anchor.set(0.5);
      sprite.eventMode = "static";
      sprite.position.set(Math.random() * 700, Math.random() * 900);

      const entity = prefabs.city.build("City " + i);
      entity.view = sprite;
      entity.parent = map;

      sprite.onmouseover = () => {
        world.addComponent(cityStats, "cityStats", {
          city: entity.city!,
          position: { x: sprite.x, y: sprite.y },
        });
      };
      sprite.onmouseout = () => world.removeComponent(cityStats, "cityStats");

      world.add(entity);
    }
  };
};

engine.start(async (world, _systems) => {
  const [{ engine }] = world.with("engine");

  await engine.state.enter(loading(world));
  await engine.state.enter(game(world));
});
