import { Entity } from "../systems/engine";

export function build(name: string): Entity {
  const city = {
    name,
    population: 1000,
    resources: {
      food: 1000,
      wood: 1000,
      stone: 1000,
      gold: 1000,
    },
    buildings: [],
  };

  return {
    city,
  };
}
