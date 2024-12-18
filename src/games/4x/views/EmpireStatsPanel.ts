import { Graphics, Text } from 'pixi.js'
import { Layout } from '@pixi/layout'
import { Region } from '../objects'

function text() {
    return new Text({
        style: {
            fill: 0xffffff,
            fontSize: 20,
            fontFamily: 'Akaya Kanadaka',
            align: 'center',
        },
    })
}

export class EmpireStatsPanel extends Layout {
    private readonly empireName: Text
    private readonly economy: Text
    private readonly technology: Text
    private readonly labors: Text

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
                position: 'center',
                width: 100,
                height: 100,
            },
        })

        this.empireName = text()
        this.addContent(this.empireName)

        this.economy = text()
        this.addContent(this.economy)

        this.labors = text()
        this.addContent(this.labors)

        this.technology = text()
        this.addContent(this.technology)
    }

    update(region: Region) {
        const { empire } = region
        if (!empire) {
            this.visible = false
            return
        }
        this.visible = true
        this.empireName.text = empire?.name ?? 'Anarchy'
        this.economy.text = `Economy: ${empire?.economy ?? 0}`
        this.labors.text = `Labors: ${empire?.labors ?? 0}`
        this.technology.text = `Technology: ${empire?.technology ?? 0}`
        this.resize()
    }
}
