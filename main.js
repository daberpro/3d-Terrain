import './style.css'
import * as THREE from 'three'
// default controls was Orbit Controls
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import stats from 'three/examples/jsm/libs/stats.module'
import { createLand } from './proceduralLandMass';
import {GUI} from 'dat.gui'
import { lerp } from './math'
import { onlyMoveXZ, pointerLock } from './controls'
import { createChunks } from './chunks'

// const option = {
//   width: 100,
//   height: 100,
//   minHeight: -3,
//   maxHeight: 3,
//   scale: 30
// }

class WORLD {

  Scene = new THREE.Scene();
  Camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  Render = new THREE.WebGLRenderer({ antialias: true });
  Controls = null;
  Stats = new stats();

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setupCamera() {
    this.Scene.add(this.Camera);
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.Camera.position.z = 10;
    this.Camera.position.y = 20;
  }

  setupControls() {
    this.Controls = new OrbitControls(this.Camera, this.Render.domElement);
    // this.Controls = new PointerLockControls(this.Camera,document.body);
    // this.Controls.pointerSpeed = 1;
    // this.PointerLock = pointerLock(this.Controls,1);

  }

  setupHelper() {
    const grid = new THREE.GridHelper(this.width, this.height)
    grid.position.y = 20;
    this.Scene.add(grid);
  }

  setupWorldEnvoritment() {
    const ambientLight = new THREE.AmbientLight(new THREE.Color('gray'));
    const directionalLight = new THREE.DirectionalLight(new THREE.Color('white'), 0.5);

    directionalLight.position.y = 25;

    this.Scene.add(ambientLight);
    this.Scene.add(directionalLight);
    this.Scene.add(new THREE.DirectionalLightHelper(directionalLight, 5))

    this.Render.shadowMap.enabled = true;
    this.Render.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // this.Scene.fog = new THREE.Fog(new THREE.Color('white'),50,150)
  }


  initObjects() {

    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color('red') });
    const cube = new THREE.Mesh(box, material);

    cube.position.y = 20;
    this.cubeControl = onlyMoveXZ(cube,0.1,this.Camera);
    this.player = cube;
    // this.player.position.copy(new THREE.Vector3(
    //   this.Camera.position.x,
    //   this.Camera.position.y-1,
    //   this.Camera.position.z
    // ))
    this.Scene.add(cube);

    
    // const gui = new GUI();
    // const folder = gui.addFolder('land mass');
    // folder.add(option,'width',100);
    // folder.add(option,'height',100);
    // folder.add(option,'minHeight',-3);
    // folder.add(option,'maxHeight',3);
    // folder.add(option,'scale',30);
    // folder.open();


    this.chunks = createChunks(150,50,50,50);
    this.chunks.render(this.Scene);
  }

  init() {
    this.setupCamera();
    this.setupControls();
    this.setupHelper();
    this.setupWorldEnvoritment();
    this.initObjects();
    document.body.appendChild(this.Render.domElement);
    document.body.appendChild(this.Stats.dom);
    this.Render.setSize(window.innerWidth, window.innerHeight);
    this.Scene.background = new THREE.Color('skyblue');

    window.onresize = d =>{
      this.Render.setSize(window.innerWidth, window.innerHeight);
      this.Camera.aspect = innerWidth/innerHeight;
      this.Camera.updateProjectionMatrix();
    }

  }

  loop() {
    this.Render.render(this.Scene, this.Camera);
    this.Stats.update();
    this.cubeControl.update();
    this.chunks.update({...this.player.position,r: 4},this.Scene);
    this.PointerLock.update();


    // this.player.position.copy(new THREE.Vector3(
    //   this.Camera.position.x,
    //   this.Camera.position.y-1,
    //   this.Camera.position.z
    // ))
    // this.land.update();
  }
}


const Game = new WORLD(20, 20);
Game.init();
function loop() {
  requestAnimationFrame(loop);
  Game.loop();
  
}
loop();