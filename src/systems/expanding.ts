import { World } from 'miniplex'
import { Entity } from '../entity'
import { Ticker } from 'pixi.js'

export function expanding(world: World<Entity>) {
    const entities = world.with('empire')
    let lastUpdate = 0

    return (ticker: Ticker) => {
        if (ticker.lastTime - lastUpdate < 1000) {
            return
        }
        lastUpdate = ticker.lastTime
        for (const { empire } of entities) {
        }
    }
}

// public boolean expandEmpire() {
//     boolean annexedStuff = false;

//     for(int i = this.hexList.size() - 1; i >= 0; i--) { // Making this normal instead of reversed seems to behave like a clustering function...
//         HexList surroundingTiles = this.hexList.get(i).getSurroundingHexes();
//         for(int j = 0; j < surroundingTiles.size(); j++) {
//             if(surroundingTiles.get(j).getEmpire() == null) {
//                 this.annexTile(surroundingTiles.get(j));
//                 annexedStuff = true;
//             }
//         }
//     }

//     return annexedStuff;
// }
