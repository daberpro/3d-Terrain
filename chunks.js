import { createLand } from "./proceduralLandMass"
import { SpriteText2D, textAlign } from 'three-text2d'
import * as THREE from 'three'

class Chunk {
    land = null;
    distance = 0;
    chunkSize = 1;
    constructor(x, y, r, w = 50, h = 50, seed = 0, chunkSize = 1) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.land = createLand(w, h, 0, 40, 1, seed, this.x, this.y, this.r);
        this.land.mesh.visible = false;
        this.land.water.visible = false;
        this.chunkSize = chunkSize;
    }

    update(player) {
        this.distance = Math.sqrt((Math.round(player.x / this.chunkSize) - (this.x+0.5)) ** 2 + (Math.round(-player.z / this.chunkSize) - (this.y+0.5)) ** 2);

        if (this.distance < player.r / 2 + this.r / 2) {
            this.land.mesh.visible = true;
            this.land.water.visible = true;
        } else {
            this.land.mesh.visible = false;
            this.land.water.visible = false;
        }

    }

}

export const createChunks = (maxViewDistance, chunkSize, width, height) => {

    const chunkRadius = Math.round(maxViewDistance / chunkSize)
    const grid = [];
    const chunks = new Map();
    const seed = Math.random()

    for (let x = 0; x < chunkRadius; x++) {
        for (let y = 0; y < chunkRadius; y++) {
            grid.push(
                new Chunk(x, y, 1, width, height, seed, chunkSize)
            );
            chunks.set(`${x}:${y}`, grid[grid.length - 1]);
        }
    }

    return {
        render(Scene) {
            for (let x = 0; x < grid.length; x++) {
                // const label = new TextGeometry(`${grid[x].land.xoffset}:${grid[x].land.yoffset}`,{});
                // const label_m = new THREE.MeshBasicMaterial({color: new THREE.Color('black')})
                // var sprite = new SpriteText2D(
                //     `${grid[x].land.xoffset}:${grid[x].land.yoffset}`,
                //     {
                //         align: textAlign.center,
                //         font: '20px Arial',
                //         fillStyle: 'black',
                //         antialias: true
                //     }
                // )
                // // l.center()
                // sprite.position.copy(grid[x].land.mesh.position)
                // sprite.position.x += 25;
                // sprite.position.z -= 25;
                // sprite.position.y = 60
                // Scene.add(sprite);
                // grid[x].land.mesh.visible = false;
                Scene.add(grid[x].land.mesh);
                Scene.add(grid[x].land.water);
            }
        },
        update(player, Scene) {
            for (let o of grid) {
                o.update(player);
                // console.log(Math.min(...grid.map(d => d.distance)),o.distance)
                if (Math.min(...grid.map(d => d.distance)) === o.distance) {

                    o.land.mesh.visible = true;

                    if(!chunks.has(`${o.x-1}:${o.y+1}`)){
                        const land = new Chunk((o.x-1),(o.y+1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x-1}:${o.y+1}`,land)
                    }

                    if(!chunks.has(`${o.x}:${o.y+1}`)){
                        const land = new Chunk((o.x),(o.y+1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x}:${o.y+1}`,land)
                    }

                    if(!chunks.has(`${o.x+1}:${o.y+1}`)){
                        const land = new Chunk((o.x+1),(o.y+1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x+1}:${o.y+1}`,land)
                    }

                    if(!chunks.has(`${o.x+1}:${o.y}`)){
                        const land = new Chunk((o.x+1),(o.y),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x+1}:${o.y}`,land)
                    }

                    if(!chunks.has(`${o.x+1}:${o.y-1}`)){
                        const land = new Chunk((o.x+1),(o.y-1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x+1}:${o.y-1}`,land)
                    }
                    if(!chunks.has(`${o.x}:${o.y-1}`)){
                        const land = new Chunk((o.x),(o.y-1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x}:${o.y-1}`,land)
                    }
                    if(!chunks.has(`${o.x-1}:${o.y-1}`)){
                        const land = new Chunk((o.x-1),(o.y-1),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x-1}:${o.y-1}`,land)
                    }
                    if(!chunks.has(`${o.x-1}:${o.y}`)){
                        const land = new Chunk((o.x-1),(o.y),1,width,height,seed,chunkSize);
                        grid.push(land);
                        Scene.add(land.land.mesh);
                        Scene.add(land.land.water);
                        chunks.set(`${o.x-1}:${o.y}`,land)
                    }

                }
            }
            
        }
    }


}