import { World } from "miniplex";
import { Entity } from "./engine";
import { Ticker } from "pixi.js";

export function rotatingSystem(world: World<Entity>) {
  const entities = world.with("transfrom", "rotating");

  return (ticker: Ticker) => {
    for (const entity of entities) {
      entity.transfrom.rotation += entity.rotating.speed * ticker.deltaMS;
    }
  };
}
