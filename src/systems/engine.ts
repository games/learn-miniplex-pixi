import { Bucket, World } from "miniplex";
import { Application, Container, Ticker } from "pixi.js";
import { transfromSystem } from "./transfrom";
import { rotatingSystem } from "./rotating";

export type Entity = {
  transfrom?: Container;
  parent?: Entity;
  engine?: {
    application: Application;
    scene: Container;
  };
  rotating?: {
    speed: number;
  };
};

export type System = (ticker: Ticker) => void;

export async function start(
  init: (world: World<Entity>, systems: Bucket<System>) => Promise<void>
) {
  const world = new World<Entity>();
  const systems = new Bucket<System>();

  systems.add(transfromSystem(world));
  systems.add(rotatingSystem(world));

  const application = new Application();
  await application.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(application.canvas);

  const engine = {
    application,
    scene: application.stage,
  };
  world.add({ engine });

  await init(world, systems);

  application.ticker.add((ticker) => {
    for (const system of systems) {
      system(ticker);
    }
  });
}
