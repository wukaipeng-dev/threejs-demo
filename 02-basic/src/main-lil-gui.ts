import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近裁面
  1000 // 远裁面
)

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 创建网格
const cube = new THREE.Mesh(geometry, material)

// 创建父级几何体
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
// 创建父级网格
const parentCube = new THREE.Mesh(geometry, parentMaterial)
// 将几何体添加到父级网格中
parentCube.add(cube)

// 设置 cub 位置
cube.position.x = 2
// 设置 cub 的旋转
cube.rotation.x = Math.PI / 4

// 设置父级位置
parentCube.position.x = -2

// 将几何体添加到场景中
scene.add(parentCube)

// 设置相机位置
camera.position.z = 5
camera.position.x = 2
camera.position.y = 2
camera.lookAt(0, 0, 0)

// 添加坐标轴
const axes = new THREE.AxesHelper(5)
scene.add(axes)

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.05
// 设置旋转速度
// controls.autoRotate = true

// 渲染
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}

animate()

// 监听窗口大小
window.addEventListener('resize', () => {
  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机
  camera.updateProjectionMatrix()
})

// 点击全屏
// const button = document.createElement('button')
// button.innerText = '点击全屏'
// button.style.position = 'absolute'
// button.style.top = '10px'
// button.style.left = '10px'
// button.style.zIndex = '9999'
// document.body.appendChild(button)

// button.onclick = () => {
//   document.documentElement.requestFullscreen()
// }

// // 退出全屏按钮
// const exitFullscreenButton = document.createElement('button')
// exitFullscreenButton.innerText = '退出全屏'
// exitFullscreenButton.style.position = 'absolute'
// exitFullscreenButton.style.top = '10px'
// exitFullscreenButton.style.left = '100px'
// exitFullscreenButton.style.zIndex = '9999'
// document.body.appendChild(exitFullscreenButton)

// exitFullscreenButton.onclick = () => {
//   document.exitFullscreen()
// }

// 创建 GUI
const gui = new GUI()

const events = {
  fullscreen: () => {
    document.documentElement.requestFullscreen()
  },
  exitFullscreen: () => {
    document.exitFullscreen()
  },
}

gui.add(events, 'fullscreen').name('点击全屏')
gui.add(events, 'exitFullscreen').name('退出全屏')

// 设置 x、y、z 轴
const folder = gui.addFolder('设置 x、y、z 轴')
folder.add(cube.position, 'x').min(-10).max(10).step(0.1).name('x')
folder.add(cube.position, 'y').min(-10).max(10).step(0.1).name('y')
folder.add(cube.position, 'z').min(-10).max(10).step(0.1).name('z')

// 设置线框
const folder2 = gui.addFolder('设置线框')
folder2.add(material, 'wireframe')

// 设置颜色
const colorObject = {
  color: 0x00ff00,
}

const folder3 = gui.addFolder('设置颜色')
folder3.addColor(colorObject, 'color').onChange(() => {
  material.color.set(colorObject.color)
})
