import { pixiPipes } from '@assetpack/core/pixi'

export default {
    entry: './raw-assets',
    output: './public/assets',
    pipes: [
        ...pixiPipes({
            cacheBust: false,
            manifest: {
                trimExtensions: true,
                nameStyle: 'relative',
            },
            texturePacker: {
                texturePacker: {
                    nameStyle: 'relative',
                    removeFileExtension: true,
                },
            },
        }),
    ],
}
