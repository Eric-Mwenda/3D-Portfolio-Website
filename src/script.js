import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Vector3 } from 'three';

//Loading Texture
const textureLoader = new THREE.TextureLoader();
const moonNormalMap = textureLoader.load('/Textures/CoolFlowerNormalMap3.jpg');

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const mySphereGeometry = new THREE.SphereBufferGeometry(.5, 32, 16);
// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = .7;
material.roughness = .2;
material.normalMap = moonNormalMap;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(mySphereGeometry,material);
scene.add(sphere);

// Lights

//First Point Light.

const pointLight = new THREE.PointLight(0xffffff, .1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight);

//PointLight Red.

const pointLightRed = new THREE.PointLight(0xff0000, 5);
pointLightRed.position.set(-.7,1.05,-0.36);
scene.add(pointLightRed);

//Reate a floder for it in the gui.
const redLight = gui.addFolder('Red Lighting');

redLight.add(pointLightRed.position, 'x').min(-5).max(5).step(.01);
redLight.add(pointLightRed.position, 'y').min(-5).max(5).step(.01);
redLight.add(pointLightRed.position, 'z').min(-5).max(5).step(.01);
redLight.add(pointLightRed, 'intensity').min(0).max(10).step(.01);

//Add PointLightHelpers for the Red Light, these wlll act as gizmos in Unity.
// const pointLightHelper = new THREE.PointLightHelper(pointLightRed, .3);//Second parameter represents the size of the helper.
// scene.add(pointLightHelper);

//Point Light blue.
//Adding the Second Blue Point Light
const pointLightBlue = new THREE.PointLight(0xe1ff, 8);
pointLightBlue.position.set(.9,-.8,.6);
scene.add(pointLightBlue);

//Add a folder for it.
const blueLight = gui.addFolder('Blue Lighting');

blueLight.add(pointLightBlue.position, 'x').min(-5).max(5).step(.01);
blueLight.add(pointLightBlue.position, 'y').min(-5).max(5).step(.01);
blueLight.add(pointLightBlue.position, 'z').min(-5).max(5).step(.01);
blueLight.add(pointLightBlue, 'intensity').min(0).max(10).step(.01);

//to control the colors using the GUI, crete an object inorder to get its color properties.
const blueLightColor = {
    color: 0xff0000
}
blueLight.add(blueLightColor, 'color')
    .onChange(()=>{
       pointLightBlue.color.set(blueLightColor.color)
    })

//Add PointLightHelpers, these wlll act as gizmos in Unity.
// const pointLightHelperBlue = new THREE.PointLightHelper(pointLightBlue, .3);//Second parameter represents the size of the helper.
// scene.add(pointLightHelperBlue);  

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

//This section is to make it interactive with teh mouse input or position.
//here we add an event listener and make it notify a function.
//The second parameter represents the function that will be called when the mouse is moved.
document.addEventListener('mousemove', onMouseMoved);

let mousePositionX = 0;
let mousePositionY = 0;

let targetPositionX = 0;
let targetPositionY = 0;

//These represent the half sizes of the viewport window.
const windowHalfSizeX = window.innerWidth / 2;
const windowHalfSizeY = window.innerHeight / 2;
//clientX or Y has to refer with the current moust position with the referenced axis in relative to another position.
function onMouseMoved(event){
    mousePositionX = (event.clientX - windowHalfSizeX);
    mousePositionY = (event.clientY - windowHalfSizeY);
}

//update the sphere size when the window is scrolled.
const updateSphereOnScroll = (event)=>{
    sphere.position.y = window.scrollY * .001;
}
window.addEventListener('scroll', updateSphereOnScroll);

const clock = new THREE.Clock()

const tick = () =>
{
    targetPositionX = mousePositionX * .001;
    targetPositionY = mousePositionY * .001;

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;

    //Make it rotate now in relation to the mousePosition.
    sphere.rotation.y += .5 * (targetPositionX - sphere.rotation.y);
    sphere.rotation.x += .05 * (targetPositionY - sphere.rotation.x);
    sphere.position.z += -.05 * (targetPositionY - sphere.rotation.x);
    

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()