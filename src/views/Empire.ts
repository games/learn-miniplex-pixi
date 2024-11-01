import { ColorSource, Container, Graphics } from 'pixi.js'

type EmpireOptions = {
    color: ColorSource
}

export class Empire extends Container {
    constructor(options: EmpireOptions) {
        super()
        const g = new Graphics().circle(0, 0, 10).fill(options.color)
        this.addChild(g)
    }
}
