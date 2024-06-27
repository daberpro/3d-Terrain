import * as Noise from 'three/examples/jsm/math/SimplexNoise'
import * as THREE from 'three'
import { lerp } from './math';
import { FBM } from 'three-noise';
export const createLand = (width, height, minHeight = -1, maxHeight = 1, vertexSize = 1, seed = 0, xoffset, yoffset, radius) => {

    const perlinNoise = new Noise.SimplexNoise();
    // menambahkan width dengan 1 agar seluruh chunk bisa di render
    const noise = new Array(width + 1).fill(0).map(d => []);
    const fbm = new FBM({
        seed,
        octaves: 15,
        lacunarity: 2,
        persistance: 0.5,
        scale: 0.1
    })


    // mengset FBM untuk seluruh chunk
    let dx = xoffset * 0.1 * width;
    for (let x = 0; x < width + 1; x++) {
        let dy = yoffset * 0.1 * height;
        for (let y = 0; y < height + 1; y++) {
            noise[x][y] = fbm.get2(new THREE.Vector2(dx, dy)) * THREE.MathUtils.lerp(-3, 3, fbm.get2(new THREE.Vector2(dx, dy)));
            dy += 0.1;
        }
        dx += 0.1;
    }

    const vertex = [];
    const colors = [];
    const water = [];
    let color = new THREE.Color('white');
    let x = 0, y = 0;
    let max = 0, min = 0, tmax = 0;

    // memasukan seluruh vertex beserta FBM nya
    for (let i = 0; i < ((width) * (height)); i++) {
        if (x >= width) {
            x = 0;
            y++;
        }

        let noise1 = lerp(minHeight, maxHeight, noise[x][y]);
        let noise2 = lerp(minHeight, maxHeight, noise[x][y + 1]);
        let noise3 = lerp(minHeight, maxHeight, noise[x + 1][y]);
        let noise4 = lerp(minHeight, maxHeight, noise[x + 1][y + 1]);
        min = Math.min(min, noise1, noise2, noise3, noise4);
        max = Math.max(max, noise1, noise2, noise3, noise4);

        const t = (lerp(0, 4, noise[x][y]))
        tmax = Math.max(tmax, t);

        if (t < 0) {
            // set warna biru untuk air dan gradiasi terang-gelap warna
            color = new THREE.Color('#00bcd4')
            color.r += noise[x][y];
            color.g += noise[x][y];
            color.b += noise[x][y];

            water.push(new THREE.Vector3(x * vertexSize, y * vertexSize, 0));
            water.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize + vertexSize, 0));
            water.push(new THREE.Vector3(x * vertexSize, y * vertexSize + vertexSize, 0));

            water.push(new THREE.Vector3(x * vertexSize, y * vertexSize, 0));
            water.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize, 0));
            water.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize + vertexSize, 0));
        } else if (t >= 0 && t <= 0.2) {

            // set warna kuning untuk pasir dan gradiasi terang-gelap warna
            color = new THREE.Color('#C2B280')
            color.r -= noise[x][y] / 2;
            color.g -= noise[x][y] / 2;
            color.b -= noise[x][y] / 2;
        } else if (t >= 0.2 && t < 2) {
            // set warna hijau untuk rumput dan gradiasi terang-gelap warna
            color = new THREE.Color('#4caf50')
            color.r -= noise[x][y] / 2;
            color.g -= noise[x][y] / 2;
            color.b -= noise[x][y] / 2;
        } else if (t >= 2 && t < 4) {
            // set warna abu-abu untuk batu dan gradiasi terang-gelap warna
            color = new THREE.Color('gray')
        } else if (t >= 4) {
            // set warna putih untuk salju dan gradiasi terang-gelap warna
            color = new THREE.Color('white')
        }
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);

        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);

        // segitiga 1 
        /**
         * dengan kordinat
         * (x,y) -> (x+1,y+1) -> (x,y+1) [1]
         * (x,y) -> (x+1,y) -> (x+1,y+1) [2]
         */
        vertex.push(new THREE.Vector3(x * vertexSize, y * vertexSize, noise1));
        vertex.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize + vertexSize, noise4));
        vertex.push(new THREE.Vector3(x * vertexSize, y * vertexSize + vertexSize, noise2));

        vertex.push(new THREE.Vector3(x * vertexSize, y * vertexSize, noise1));
        vertex.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize, noise3));
        vertex.push(new THREE.Vector3(x * vertexSize + vertexSize, y * vertexSize + vertexSize, noise4));

        x++;
    }

    const l = new THREE.BufferGeometry().setFromPoints(vertex);
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, wireframe: false })//({ color: new THREE.Color('white'), wireframe: false });
    const g = new THREE.Mesh(l, m);
    l.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.castShadow = true;
    g.receiveShadow = true;
    l.computeVertexNormals()
    g.rotation.x = -Math.PI / 2;
    g.position.x = (xoffset) * width;
    g.position.z = -(yoffset) * height;

    const water_object = new THREE.BufferGeometry().setFromPoints(water);
    const m_water_object = new THREE.MeshStandardMaterial({ color: new THREE.Color('#00bcd4'), vertexColors: false, wireframe: false })//({ color: new THREE.Color('white'), wireframe: false });
    const g_water_object = new THREE.Mesh(water_object, m_water_object);
    // water_object.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g_water_object.castShadow = true;
    g_water_object.receiveShadow = true;
    water_object.computeVertexNormals()
    g_water_object.rotation.x = -Math.PI / 2;
    g_water_object.position.x = (xoffset) * width;
    g_water_object.position.z = -(yoffset) * height;

    return {
        mesh: g,
        water: g_water_object,
        max,
        min,
        tmax,
        vertex,
        xoffset,
        yoffset,
        BufferGeometry: l,
        colorsMap: colors
    };

}