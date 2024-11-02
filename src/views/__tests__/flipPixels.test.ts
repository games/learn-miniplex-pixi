import { expect, test } from 'vitest'
import { flipPixels } from '../flipPixels'

test('flip pixels should works', () => {
    const input = {
        width: 2,
        height: 4,
        pixels: new Uint8ClampedArray([
            1, 2, 3, 4, 5, 6, 7, 8,
            9, 0, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9,
            3, 4, 5, 6, 7, 8, 9, 0
        ]),
    }
    const output = flipPixels(input, 4)
    expect(output.width).toBe(2)
    expect(output.height).toBe(4)
    expect([...output.pixels]).toStrictEqual([
        3, 4, 5, 6, 7, 8, 9, 0,
        2, 3, 4, 5, 6, 7, 8, 9,
        9, 0, 1, 2, 3, 4, 5, 6,
        1, 2, 3, 4, 5, 6, 7, 8
    ])
})

test('flip pixels should works 2', () => {
    const input = {
        width: 1,
        height: 2,
        pixels: new Uint8ClampedArray([0, 1, 1, 0]),
    }
    const output = flipPixels(input, 2)
    expect(output.width).toBe(1)
    expect(output.height).toBe(2)
    expect([...output.pixels]).toStrictEqual([1, 0, 0, 1])
})
