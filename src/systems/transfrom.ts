import { World } from "miniplex";
import { Entity } from "./engine";

export function transfromSystem(world: World<Entity>) {
  const entities = world.with("transfrom");
  const engines = world.with("engine");

  entities.onEntityAdded.subscribe((entity) => {
    const [{ engine }] = engines;
    if (entity.parent?.transfrom) {
      entity.parent.transfrom.addChild(entity.transfrom);
    } else {
      engine.scene.addChild(entity.transfrom);
    }
  });

  entities.onEntityRemoved.subscribe((entity) => {
    entity.parent?.transfrom?.removeChild(entity.transfrom);
  });

  return () => {};
}
