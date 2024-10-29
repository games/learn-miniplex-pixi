import { Container, Graphics, Text } from "pixi.js";
import { City } from "../components";

export class CityStatsPanel extends Container {
  private readonly cityName: Text;

  constructor() {
    super();
    this.position.set(10, 10);
    this.eventMode = "static";
    this.interactiveChildren = false;
    this.cursor = "pointer";

    const bg = new Graphics()
      .rect(0, 0, 200, 100)
      .fill({ color: 0x000000, alpha: 0.5 })
      .stroke({
        color: 0xffffff,
        width: 1,
      });
    this.addChild(bg);

    this.cityName = new Text({
      text: "City Name",
      style: {
        fill: 0xffffff,
        fontSize: 16,
      },
    });
    this.addChild(this.cityName);
  }

  update(city: City) {
    this.cityName.text = city.name;
  }
}
