import { Container, Text } from 'pixi.js'

export class GameTime extends Container {
    private readonly text: Text

    constructor() {
        super()
        this.text = new Text({
            text: '000-00-00',
            style: {
                fill: 0xffffff,
                fontSize: 20,
                fontFamily: 'Akaya Kanadaka',
                align: 'center',
            },
        })
        this.addChild(this.text)
    }

    update(time: { year: number; month: number; day: number }) {
        this.text.text = `${time.year}-${time.month + 1}-${time.day + 1}`
    }
}
