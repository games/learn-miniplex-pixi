import { GetPixelsOutput } from 'pixi.js'

export function flipPixels(pixels: GetPixelsOutput, elements = 4) {
    const array = []
    for (let y = pixels.height - 1; y >= 0; y--) {
        for (let x = 0; x < pixels.width; x++) {
            for (let i = 0; i < elements; i++) {
                const offset = x * elements + y * pixels.width * elements + i
                array.push(pixels.pixels[offset])
            }
        }
    }
    return {
        width: pixels.width,
        height: pixels.height,
        pixels: new Uint8ClampedArray(array),
    }
}

// export function flipPixels(pixels: GetPixelsOutput) {
//     const { width, height } = pixels
//     let halfHeight = (height / 2) | 0 // the | 0 keeps the result an int
//     let bytesPerRow = width * 4

//     // make a temp buffer to hold one row
//     let temp = new Uint8Array(width * 4)
//     for (let y = 0; y < halfHeight; ++y) {
//         let topOffset = y * bytesPerRow
//         let bottomOffset = (height - y - 1) * bytesPerRow

//         // make copy of a row on the top half
//         temp.set(pixels.pixels.subarray(topOffset, topOffset + bytesPerRow))

//         // copy a row from the bottom half to the top
//         pixels.pixels.copyWithin(
//             topOffset,
//             bottomOffset,
//             bottomOffset + bytesPerRow
//         )

//         // copy the copy of the top half row to the bottom half
//         pixels.pixels.set(temp, bottomOffset)
//     }

//     return pixels
// }
