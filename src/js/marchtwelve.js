import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import sunTexture from "../images/planetTextures/sunTexture.jpeg";
import mercuryTexture from "../images/planetTextures/mercuryTexture.jpeg";
import saturnTexture from "../images/planetTextures/saturnTexture.jpg";
import saturnRingTexture from "../images/planetTextures/saturnRingTexture.png";
import earthTexture from "../images/planetTextures/earthTexture.jpeg";
import jupiterTexture from "../images/planetTextures/jupiterTexture.jpeg";
import marsTexture from "../images/planetTextures/marsTexture.jpeg";
import venusTexture from "../images/planetTextures/venusTexture.jpeg";
import uranusTexture from "../images/planetTextures/uranusTexture.jpg";
import neptuneTexture from "../images/planetTextures/neptuneTexture.jpg";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 100, 300);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 6000, 400);
scene.add(pointLight);
const textureLoader = new THREE.TextureLoader();
const materials = {
  sun: textureLoader.load(sunTexture),
  mercury: textureLoader.load(mercuryTexture),
  venus: textureLoader.load(venusTexture),
  saturn: textureLoader.load(saturnTexture),
  saturnRing: textureLoader.load(saturnRingTexture),
  earth: textureLoader.load(earthTexture),
  jupiter: textureLoader.load(jupiterTexture),
  mars: textureLoader.load(marsTexture),
  uranus: textureLoader.load(uranusTexture),
  neptune: textureLoader.load(neptuneTexture),
};
for (const textureName in materials) {
  materials[textureName].encoding = THREE.sRGBEncoding;
}
//materials.saturn.rotation = Math.PI / 2; //
class Sphere extends THREE.Mesh {
  constructor({ width, height, vertice, texture }) {
    super(
      new THREE.SphereGeometry(width, height, vertice),
      new THREE.MeshStandardMaterial({ map: texture })
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

class PlanetObject {
  constructor({ planetParams, position }) {
    const { width, height = 30, vertice = 30, texture } = planetParams;
    this.parent = new THREE.Object3D();
    this.planet = new Sphere({ width, height, vertice, texture });
    this.parent.add(this.planet);
    this.planet.position.copy(position);
    scene.add(this.parent);
  }
}

const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMesh = new THREE.MeshBasicMaterial({ map: materials.sun });
const sun = new THREE.Mesh(sunGeometry, sunMesh);
scene.add(sun);

const mercury = new PlanetObject({
  planetParams: {
    width: 3.2,
    texture: materials.mercury,
  },
  position: new THREE.Vector3(30, 0, 0),
});

const venus = new PlanetObject({
  planetParams: {
    width: 5,
    texture: materials.venus,
  },
  position: new THREE.Vector3(40, 0, 0),
});

const earth = new PlanetObject({
  planetParams: {
    width: 6,
    texture: materials.earth,
  },
  position: new THREE.Vector3(60, 0, 0),
});

const mars = new PlanetObject({
  planetParams: {
    width: 4,
    height: 30,
    vertice: 30,
    texture: materials.mars,
  },
  position: new THREE.Vector3(80, 0, 0),
});

const jupiter = new PlanetObject({
  planetParams: {
    width: 12,
    height: 30,
    vertice: 30,
    texture: materials.mars,
  },
  position: new THREE.Vector3(100, 0, 0),
});

const saturn = new PlanetObject({
  planetParams: {
    width: 4.2,
    texture: materials.saturn,
  },
  position: new THREE.Vector3(120, 0, 0),
});
const satRingGeo = new THREE.RingGeometry(9, 13, 32);
const satRingMat = new THREE.MeshStandardMaterial({
  map: materials.saturnRing,
  side: THREE.DoubleSide,
  transparent: true,
});
const saturnRing = new THREE.Mesh(satRingGeo, satRingMat);
saturn.planet.add(saturnRing);
saturnRing.position.set(0, 0, 0);
saturnRing.rotation.x = 180;

const uranus = new PlanetObject({
  planetParams: {
    width: 7,
    texture: materials.uranus,
  },
  position: new THREE.Vector3(200, 0, 0),
});

const neptune = new PlanetObject({
  planetParams: {
    width: 9,
    texture: materials.neptune,
  },
  position: new THREE.Vector3(220, 0, 0),
});

function animate() {
  sun.rotateY(0.004);
  //mercury.planet.rotateY(0.004);
  mercury.planet.rotateY(0.04);
  venus.planet.rotateY(0.002);
  earth.planet.rotateY(0.02);
  mars.planet.rotateY(0.018);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.038);
  uranus.planet.rotateY(0.03);
  neptune.planet.rotateY(0.032);

  mercury.parent.rotateY(0.04);
  venus.parent.rotateY(0.015);
  earth.parent.rotateY(0.01);
  mars.parent.rotateY(0.008);
  jupiter.parent.rotateY(0.002);
  saturn.parent.rotateY(0.001);
  uranus.parent.rotateY(0.0005);
  neptune.parent.rotateY(0.0007);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
