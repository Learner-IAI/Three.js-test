/*******************************
 * Three.js test main JS file
 *******************************/

/* CSS styles import */
import './styles.css';

/* Shaders code import */
/*
import vertShader from './main.vert';
import fragShader from './main.frag';
*/

/* Three.js library import */
import * as THREE from 'three';
/* Orbit controls import */
import { OrbitControls } from 'three-orbitcontrols/OrbitControls.js';

/* Main drawing context representation class */
class Drawer {
  constructor (canvas) {
    this.startTime = Date.now();

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
    this.camera.position.set(8, 8, 8);
    this.camera.lookAt(this.scene.position);

    this.controls = new THREE.OrbitControls(this.camera, canvas);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.meshes = {};
  }

  addMesh (geometry, material, func, name) {
    const newMesh = new THREE.Mesh(geometry, material);
    func && func(newMesh);
    this.scene.add(newMesh);
    this.meshes[name] = newMesh;
  }

  init () {
    const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 8, 0);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 8;
    this.scene.add(spotLight);

    const sphereGeom = new THREE.SphereGeometry(0.5, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffaa,
      specular: 0xdddd00,
      shininess: 100
    });
    this.addMesh(sphereGeom, sphereMaterial, function (sphere) {
      sphere.position.x = 2.5;
      sphere.position.y = 2;
      sphere.castShadow = true;
      sphere.receiveShadow = false;
    }, 'sphere1');
    this.addMesh(sphereGeom, sphereMaterial, function (sphere) {
      sphere.position.x = -2.5;
      sphere.position.y = 2;
      sphere.castShadow = true;
      sphere.receiveShadow = false;
    }, 'sphere2');

    const planeGeom = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xefefef,
      specular: 0xffffff,
      side: THREE.DoubleSide
    });
    this.addMesh(planeGeom, planeMaterial, function (plane) {
      plane.rotation.x = -Math.PI / 2;
      plane.castShadow = false;
      plane.receiveShadow = true;
    }, 'plane');
  }

  response () {
    const time = (Date.now() - this.startTime) / 500;
    this.meshes.sphere1.position.x = 2.5 * Math.abs(Math.sin(time) + 2) / 2 * Math.cos(time);
    this.meshes.sphere1.position.z = 2.5 * Math.abs(Math.sin(time) + 2) / 2 * Math.sin(time);

    this.meshes.sphere2.position.x = 2.5 * Math.abs(Math.sin(time) + 2) / 2 * Math.cos(time + 10000);
    this.meshes.sphere2.position.z = 2.5 * Math.abs(Math.sin(time) + 2) / 2 * Math.sin(time + 10000);
  }

  render () {
    this.renderer.render(this.scene, this.camera);
  }
}

/* Main program drawing context */
let drawer;

/* Main render function */
function render () {
  window.requestAnimationFrame(render);

  drawer.response();
  drawer.render();
}

/* Start render function */
function threejsStart () {
  const canvas = document.getElementById('canvas');
  drawer = new Drawer(canvas);

  drawer.init();
  render();
}

/* Add event handle for dynamically updating objects */
document.addEventListener('DOMContentLoaded', threejsStart);
