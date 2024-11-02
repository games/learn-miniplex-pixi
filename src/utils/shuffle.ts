import * as IO from 'fp-ts/IO'

/** Shuffle randomly the given array, algorithm from https://stackoverflow.com/a/12646864/7033357 */
export const shuffle =
    <T>(array: T[]): IO.IO<T[]> =>
    () => {
        const source = [...array]
        for (let i = source.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[source[i], source[j]] = [source[j], source[i]]
        }

        return source
    }

export function randomPick<T>(items: T[]): T | undefined {
    return items[Math.floor(Math.random() * items.length)]
}
