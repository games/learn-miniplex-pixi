import { Assets, Sprite } from "pixi.js";
import "./style.css";
import * as engine from "./systems/engine";

engine.start(async (world, systems) => {
  const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

  for (let i = 0; i < 100; i++) {
    const sprite = new Sprite(texture);
    const rotating = Math.random() < 0.5 ? { speed: 0.01 } : undefined;
    const entity = world.add({ transfrom: sprite, rotating });

    entity.transfrom.position.set(Math.random() * 800, Math.random() * 600);
  }
});