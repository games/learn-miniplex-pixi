import { Assets, Sprite, Text } from "pixi.js";
import { World } from "miniplex";
import * as engine from "./systems/engine";
import * as prefabs from "./prefabs";
import "./style.css";

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
    for (let i = 0; i < 3; i++) {
      const sprite = Sprite.from("bunny");
      sprite.position.set(Math.random() * 350, Math.random() * 600);

      const entity = prefabs.city.build("City " + i);
      entity.view = sprite;

      world.add(entity);
    }
  };
};

engine.start(async (world, _systems) => {
  const [{ engine }] = world.with("engine");

  await engine.state.enter(loading(world));
  await engine.state.enter(game(world));
});
