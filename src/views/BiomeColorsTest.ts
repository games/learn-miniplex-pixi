import {
    Application,
    Container,
    Graphics,
    Sprite,
    Text,
    Texture,
} from 'pixi.js'
import { flipPixels } from './flipPixels'

export class BiomeColorsTest extends Container {
    constructor(application: Application) {
        super()

        const texture = Texture.from('biome-lookup-smooth')
        const pixels = application.renderer.extract.pixels(texture)
        const fliped = flipPixels(pixels)

        const canvas = application.renderer.extract.canvas(texture)
        const context = canvas.getContext('2d')

        const g = new Graphics().rect(0, 0, 20, 20).fill(0xffffff)
        g.position.set(texture.width + 2, 0)
        g.eventMode = 'none'
        this.addChild(g)

        const g2 = new Graphics().rect(0, 0, 20, 20).fill(0xffffff)
        g2.position.set(texture.width + g.width + 4, 0)
        g2.eventMode = 'none'
        this.addChild(g2)

        const text = new Text()
        text.eventMode = 'none'
        text.position.set(texture.width, g.height)
        this.addChild(text)

        const text2 = new Text()
        text2.eventMode = 'none'
        text2.position.set(texture.width, g.height + text.height * 2)
        this.addChild(text2)

        const sprite = Sprite.from(texture)
        sprite.eventMode = 'static'
        sprite.onmousemove = (e) => {
            const position = this.toLocal(e.global)
            const i =
                Math.floor(position.y * pixels.width) + Math.floor(position.x)

            const offset = i * 4
            //RGBA
            const color = {
                r: fliped.pixels[offset],
                g: fliped.pixels[offset + 1],
                b: fliped.pixels[offset + 2],
                a: fliped.pixels[offset + 3],
            }

            // use canvas
            const d = context?.getImageData(position.x, position.y, 1, 1).data!
            const color2 = {
                r: d[0],
                g: d[1],
                b: d[2],
                a: d[3],
            }

            g.tint = color
            g2.tint = color2
            text.text = `${offset} - ${fliped.pixels.length}\n${position.x}, ${position.y}: RGBA(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            text2.text = `${position.x}, ${position.y}: RGBA(${color2.r}, ${color2.g}, ${color2.b}, ${color2.a})`
        }
        this.addChild(sprite)
    }
}
