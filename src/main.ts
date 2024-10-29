import { Assets, Container, Sprite, Text } from "pixi.js";
import { World } from "miniplex";
import * as engine from "./systems/engine";
import "./style.css";

const loading = async () => {
  const view = new Container();

  const progress = new Text({
    text: "Loading...",
    style: { fill: 0xffffff },
  });
  view.addChild(progress);

  Assets.add({
    alias: "bunny",
    src: "https://pixijs.com/assets/bunny.png",
  });

  await Assets.load("bunny", (x) => {
    progress.text = `Loading... ${(x * 100).toFixed(1)}%`;
  });
};

const game = (world: World<engine.Entity>) => {
  return async () => {
    for (let i = 0; i < 100; i++) {
      const sprite = Sprite.from("bunny");
      const rotating = Math.random() < 0.5 ? { speed: 0.01 } : undefined;
      const entity = world.add({ transfrom: sprite, rotating });

      entity.transfrom.position.set(Math.random() * 800, Math.random() * 600);
    }
  };
};

engine.start(async (world, systems) => {
  const [{ engine }] = world.with("engine");

  await engine.state.enter(loading);
  await engine.state.enter(game(world));
});
