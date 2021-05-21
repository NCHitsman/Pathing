import * as THREE from '../three.js/build/three.module.js'
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
//---------------------------------------------------------------------------

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000000);
camera.position.z = 0;
camera.position.y = 3500;
new OrbitControls(camera, canvas)
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

//---------------------------------------------------------------------------

// const cubeGeo = new THREE.BoxGeometry(2000, 2000, 2000);
// const cubeMat = new THREE.MeshBasicMaterial({ wireframe: true })
// const cube = new THREE.Mesh(cubeGeo, cubeMat);
// scene.add(cube)

//---------------------------------------------------------------------------

let tester = true

function createPlane(x, z) {
    let theColor;
    if (tester) {
        theColor = 0x3A3335;
        tester = false;
    } else {
        theColor = 0x17BEBB;
        tester = true;
    }

    const planeGeometry = new THREE.PlaneGeometry(50, 50)
    const material = new THREE.MeshPhongMaterial({ color: theColor, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.x = x
    plane.position.y = -15.1
    plane.position.z = z
    plane.rotation.x = (-Math.PI / 2)
    plane.rotation.y = 0
    plane.rotation.z = 0
    scene.add(plane)
}

let lastX = 0
let lastZ = 0
let backDir;
let gridX = 0
let gridZ = 0
let grid = ''
let count = 0
let mainDir;
let dirs = ['n', 'e', 's', 'w']

const builder = () => {

    if (!mainDir) {
        mainDir = dirs[Math.floor(Math.random() * 4)]
        switch (mainDir) {
            case 'n':
                dirs = ['n', 'e', 'w']
                break;
            case 'w':
                dirs = ['n', 's', 'w']
                break;
            case 'e':
                dirs = ['n', 'e', 's']
                break;
            case 's':
                dirs = ['e', 's', 'w']
                break;
        }
    }

    let dir = dirs[Math.floor(Math.random() * 3)]

    if (dir == backDir) {
        dir = dirs[Math.floor(Math.random() * 3)]
    }

    while (grid.includes(`(${gridX}, ${gridZ + 1})`) && grid.includes(`(${gridX + 1}, ${gridZ})`) && grid.includes(`(${gridX}, ${gridZ - 1})`) && grid.includes(`(${gridX - 1}, ${gridZ})`)) {
        lastZ+= 50
        lastX+= 50
        gridX+= 10
        gridZ+= 10
        console.log('change')
    }

    switch (dir) {
        case 'n':
            if (grid.includes(`(${gridX}, ${gridZ + 1})`)) {
                return builder()
            }
            lastZ += 50;
            backDir = 's'
            gridZ += 1
            grid = grid.concat(`(${gridX}, ${gridZ}); `)
            break;
        case 'e':
            if (grid.includes(`(${gridX + 1}, ${gridZ})`)) {
                return builder()
            }
            lastX += 50;
            backDir = 'w'
            gridX += 1;
            grid = grid.concat(`(${gridX}, ${gridZ}); `)
            break;
        case 's':
            if (grid.includes(`(${gridX}, ${gridZ - 1})`)) {
                return builder()
            }
            lastZ -= 50;
            backDir = 'n'
            gridZ -= 1;
            grid = grid.concat(`(${gridX}, ${gridZ}); `)
            break;
        case 'w':
            if (grid.includes(`(${gridX - 1}, ${gridZ})`)) {
                return builder()
            }
            lastX -= 50;
            backDir = 'e'
            gridX -= 1;
            grid = grid.concat(`(${gridX}, ${gridZ}); `)
            break;
    }

    // console.log(grid)

    count++
    test()

    createPlane(lastX, lastZ)
}

const interval = setInterval(builder, 1);

function test() {
    if (count > 100) {
        clearInterval(interval)
    }
}

function kill() {
    clearInterval(interval)
}

//---------------------------------------------------------------------------
function createDirectionLight(x, y, z) {
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(x, y, z);
    scene.add(light)
}

createDirectionLight(0, 10, 10)
createDirectionLight(0, 10, -10)
createDirectionLight(0, -50)

//---------------------------------------------------------------------------

function render(time) {
    renderer.render(scene, camera);
    requestAnimationFrame(render)
}

requestAnimationFrame(render)
