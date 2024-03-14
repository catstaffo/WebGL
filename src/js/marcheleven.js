import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 10000);
camera.position.z = 550;
scene.add(camera);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.intensity = 2.5;

class Sphere extends THREE.Mesh {
  constructor({ width, height, vertice, color }) {
    super(
      new THREE.SphereGeometry(width, height, vertice),
      new THREE.MeshStandardMaterial({ color: color })
    );
    this.width = width;
    this.height = height;
    this.vertice = vertice;
    this.receiveShadow = true;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
  }
  update() {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
  }
}

var nucleus = new THREE.Group();
var protonParams = {
  width: 15,
  height: 20,
  vertice: 20,
  color: 0xff0000,
};
var neutronParams = {
  width: 15,
  height: 20,
  vertice: 20,
  color: 0x00ffff,
};
var protons = [];
var neutrons = [];
for (let i = 0; i < 2; i++) {
  protons[i] = new Sphere(protonParams);
  neutrons[i] = new Sphere(neutronParams);
}
protons[0].position.set(6, 0, 0);
protons[1].position.set(0, 4, -6);
neutrons[0].position.set(-6, 6, 3);
neutrons[1].position.set(0, -6, -3);
for (let i = 0; i < 2; i++) {
  nucleus.add(protons[i]);
  nucleus.add(neutrons[i]);
}
scene.add(nucleus);

var electronParams = {
  width: 10,
  height: 20,
  vertice: 20,
  color: 0x00ff00,
};
var electrons = [];
for (let i = 0; i < 3; i++) {
  electrons[i] = new Sphere(electronParams);
  scene.add(electrons[i]);
}

var clock = new THREE.Clock(); // Initialize a clock for the animation
function animate() {
  requestAnimationFrame(animate);
  var t = clock.getElapsedTime();

  // bottom right to top left
  electrons[0].position.set(
    Math.sin(5 * t) * -150,
    Math.sin(5 * t) * 150,
    Math.cos(5 * t) * 150
  );

  // top right to bottom left
  electrons[1].position.set(
    Math.cos(5 * t) * 150,
    Math.cos(5 * t) * 150,
    Math.sin(5 * t) * 150
  );

  var tOffset = 1.5 + clock.getElapsedTime();

  // bottom to the top
  electrons[2].position.set(
    Math.sin(5 * tOffset) * 0,
    Math.sin(5 * tOffset) * 150,
    Math.cos(5 * tOffset) * 150
  );

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
