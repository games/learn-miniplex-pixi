import { Texture, Rectangle } from 'pixi.js'

type TileDef = {
    x: number
    y: number
    texture: string
}

const size = 16

function build(def: TileDef) {
    return new Texture({
        source: Texture.from(def.texture).source,
        frame: new Rectangle(def.x * size, def.y * size, size, size),
    })
}

export const capital = (texture: string) => build({ x: 4, y: 0, texture })

export const worker = (kind: 0 | 1 | 2 | 3 | 4 | 5) =>
    build({
        x: Math.floor(kind % 4),
        y: Math.floor(kind / 4),
        texture: 'workers',
    })
