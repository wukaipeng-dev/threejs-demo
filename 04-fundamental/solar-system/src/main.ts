import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

// 创建场景
const scene = new THREE.Scene()

// 创建GUI
const gui = new GUI()

// 创建相机
const fov = 40
const aspect = 2 // the canvas default
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 50, 0)
camera.up.set(0, 0, 1)
camera.lookAt(0, 0, 0)

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

{
  const color = 0xffffff
  const intensity = 500
  const light = new THREE.PointLight(color, intensity)
  scene.add(light)
}

// an array of objects whose rotation to update
const objects: THREE.Object3D[] = []

// use just one sphere for everything
const radius = 1
const widthSegments = 6
const heightSegments = 6
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
)

const solarSystem = new THREE.Object3D()
scene.add(solarSystem)
objects.push(solarSystem)

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
sunMesh.scale.set(5, 5, 5) // make the sun large
// scene.add(sunMesh)
solarSystem.add(sunMesh)
objects.push(sunMesh)

const earthOrbit = new THREE.Object3D()
earthOrbit.position.x = 10
solarSystem.add(earthOrbit)
objects.push(earthOrbit)

const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
})
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
// earthMesh.position.x = 10
// scene.add(earthMesh);
// sunMesh.add(earthMesh)
// solarSystem.add(earthMesh)
earthOrbit.add(earthMesh)
objects.push(earthMesh)

const moonOrbit = new THREE.Object3D()
moonOrbit.position.x = 2
earthOrbit.add(moonOrbit)

const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
})
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
moonMesh.scale.set(0.5, 0.5, 0.5)
moonOrbit.add(moonMesh)
objects.push(moonMesh)

// // add an AxesHelper to each node
// for (const node of objects) {
//   const axes = new THREE.AxesHelper()
//   axes.material.depthTest = false
//   axes.renderOrder = 1
//   node.add(axes)
// }

// Turns both axes and grid visible on/off
// GUI requires a property that returns a bool
// to decide to make a checkbox so we make a setter
// can getter for `visible` which we can tell GUI
// to look at.
class AxisGridHelper {
  private grid: THREE.GridHelper
  private axes: THREE.AxesHelper
  private _visible = false

  constructor(node: THREE.Object3D, units = 10) {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 2 // after the grid
    node.add(axes)

    const grid = new THREE.GridHelper(units, units)
    grid.material.depthTest = false
    grid.renderOrder = 1
    node.add(grid)

    this.grid = grid
    this.axes = axes
    this.visible = false
  }
  get visible() {
    return this._visible
  }
  set visible(v) {
    this._visible = v
    this.grid.visible = v
    this.axes.visible = v
  }
}

function makeAxisGrid(node: THREE.Object3D, label: string, units?: number) {
  const helper = new AxisGridHelper(node, units)
  gui.add(helper, 'visible').name(label)
}

makeAxisGrid(solarSystem, 'solarSystem', 26)
makeAxisGrid(sunMesh, 'sunMesh')
makeAxisGrid(earthOrbit, 'earthOrbit')
makeAxisGrid(earthMesh, 'earthMesh')
makeAxisGrid(moonOrbit, 'moonOrbit')
makeAxisGrid(moonMesh, 'moonMesh')

// 渲染
function animate(time: number) {
  const second = time * 0.001

  for (const obj of objects) {
    obj.rotation.y = second
  }

  // 渲染
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

// 监听窗口大小
window.addEventListener('resize', () => {
  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机
  camera.updateProjectionMatrix()
})
