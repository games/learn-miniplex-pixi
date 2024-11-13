import { Container, Sprite } from 'pixi.js'
import { EmpireColors } from '../objects'
import { capital } from './tiles'

type EmpireOptions = {
    color: EmpireColors
}

export class Empire extends Container {
    constructor(options: EmpireOptions) {
        super()
        const sprite = Sprite.from(
            capital(options.color === 'Wood' ? 'Huts' : `${options.color}Huts`)
        )
        sprite.anchor.set(0.5)
        this.addChild(sprite)
    }
}
