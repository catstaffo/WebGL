import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

const renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
//const axesHelper = new three.AxesHelper(5);
//scene.add(axesHelper);

camera.position.set(5, 20, 12);
orbit.update();
/*
const boxGeometry = new three.BoxGeometry();
const boxMaterial = new three.MeshBasicMaterial({ color: 0x00ff00 });
const box = new three.Mesh(boxGeometry, boxMaterial);
scene.add(box);
*/
const planeGeometry = new three.PlaneGeometry(35, 35);
const planeMaterial = new three.MeshStandardMaterial({
  color: 0xb56b45,
  side: three.DoubleSide,
});
const plane = new three.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new three.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new three.SphereGeometry(2, 50, 20);
const sphereMaterial = new three.MeshStandardMaterial({
  color: 0xe84855,
  wireframe: false,
});
const sphere = new three.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new three.AmbientLight(0xd3d3d3);
scene.add(ambientLight);
/*
const directionalLight = new three.DirectionalLight(0xffffff, 0.9);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new three.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new three.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(dLightShadowHelper);
*/
const spotlight = new three.SpotLight(0xffffff, 1000.0);
scene.add(spotlight);
spotlight.position.set(-20, 17, 1);
spotlight.castShadow = true;
spotlight.angle = 0.5;
const sLightHelper = new three.SpotLightHelper(spotlight);
scene.add(sLightHelper);

renderer.setClearColor(0x2b3a67);

const gui = new GUI();
const options = {
  sphereColor: "#FFFD82",
  wireframe: false,
  speed: 0.024,
  angle: 0.41,
  penumbra: 0,
  intensity: 900,
};
gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 3000);
gui.add(options, "angle", 0, 1);

let step = 0;
function animate() {
  //box.rotation.x += 0.01;
  //box.rotation.y += 0.01;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));
  renderer.render(scene, camera);
  spotlight.penumbra = options.penumbra;
  spotlight.angle = options.angle;
  spotlight.intensity = options.intensity;
  spotlight.angle = options.angle;
  sLightHelper.update();
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
