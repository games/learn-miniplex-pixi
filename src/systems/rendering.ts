import { World } from "miniplex";
import { Entity } from "./engine";
import { Application } from "pixi.js";

export function renderingSystem(
  world: World<Entity>,
  application: Application
) {
  const entities = world.with("view");

  entities.onEntityAdded.subscribe((entity) => {
    if (entity.parent?.view) {
      entity.parent.view.addChild(entity.view);
    } else {
      application.stage.addChild(entity.view);
    }
  });

  entities.onEntityRemoved.subscribe((entity) => {
    entity.view.parent?.removeChild(entity.view);
  });

  return () => {};
}
