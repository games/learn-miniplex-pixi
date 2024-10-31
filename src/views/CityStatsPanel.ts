import { Graphics, Text } from "pixi.js";
import { Layout } from "@pixi/layout";
import { City } from "../components";

function text() {
  return new Text({
    style: {
      fill: 0xffffff,
      fontSize: 20,
      fontFamily: "Akaya Kanadaka",
      align: "center",
    },
  });
}

export class CityStatsPanel extends Layout {
  private readonly cityName: Text;
  private readonly food: Text;
  private readonly wood: Text;
  private readonly stone: Text;
  private readonly gold: Text;
  private readonly population: Text;

  constructor() {
    super({
      styles: {
        background: new Graphics()
          .roundRect(0, 0, 180, 180, 2)
          .fill({ color: 0x000000, alpha: 0.5 })
          .stroke({
            color: 0xffffff,
            width: 2,
          }),
        padding: 20,
        position: "center",
        width: 100,
        height: 100,
      },
    });

    this.cityName = text();
    this.addContent(this.cityName);

    this.food = text();
    this.addContent(this.food);

    this.wood = text();
    this.addContent(this.wood);

    this.stone = text();
    this.addContent(this.stone);

    this.gold = text();
    this.addContent(this.gold);

    this.population = text();
    this.addContent(this.population);
  }

  update(city: City) {
    this.cityName.text = city.name;
    this.food.text = `Food: ${city.resources.food}`;
    this.wood.text = `Wood: ${city.resources.wood}`;
    this.stone.text = `Stone: ${city.resources.stone}`;
    this.gold.text = `Gold: ${city.resources.gold}`;
    this.population.text = `Population: ${city.population}`;
    this.resize();
  }
}
