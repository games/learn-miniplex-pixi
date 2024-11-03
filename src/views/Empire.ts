import { ColorSource, Container, Sprite } from 'pixi.js'
import { capital } from './tiles'

type EmpireOptions = {
    color: ColorSource

}

export class Empire extends Container {
    constructor(options: EmpireOptions) {
        super()
        const sprite = Sprite.from(capital())
        sprite.anchor.set(0.5)
        this.addChild(sprite)
    }
}
