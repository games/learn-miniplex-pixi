import { World } from 'miniplex'
import { Assets, Text } from 'pixi.js'
import { Entity } from '../entity'

export const loading = (world: World<Entity>) => async () => {
    const progress = new Text({
        text: 'Loading...',
        style: { fill: 0xffffff },
    })

    const entity = world.add({ view: progress })

    const manifest = await fetch('/assets/manifest.json').then((x) => x.json())
    await Assets.init({ manifest, basePath: '/assets' })
    await Assets.loadBundle(['preload', 'game'], (x) => {
        progress.text = `Loading... ${(x * 100).toFixed(1)}%`
    })

    return async () => {
        world.remove(entity)
    }
}
