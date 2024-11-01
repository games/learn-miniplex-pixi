import { ColorSource, Container, Graphics } from 'pixi.js'

type EmpireOptions = {
    color: ColorSource
    size: number
}

export class Empire extends Container {
    constructor(options: EmpireOptions) {
        super()
        const g = new Graphics().circle(0, 0, options.size).fill(options.color).stroke(0x000000)
        this.addChild(g)
    }
}
