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
      engine.application.stage.addChild(entity.transfrom);
    }
  });

  entities.onEntityRemoved.subscribe((entity) => {
    entity.transfrom.parent?.removeChild(entity.transfrom);
  });

  return () => {};
}
