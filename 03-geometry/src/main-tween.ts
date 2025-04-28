import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stats from 'stats.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 引入 Tween
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
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

// 初始化性能监视器
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

// 创建一个球体
const geometry = new THREE.SphereGeometry(0.5, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphere = new THREE.Mesh(geometry, material)
sphere.position.x = -4
scene.add(sphere)

// 让球体从左到右移动
const tween = new TWEEN.Tween(sphere.position)
tween.to({ x: 4 }, 1000)
tween.onUpdate(() => {
  console.log(sphere.position.x)
})
tween.start()

const tween2 = new TWEEN.Tween(sphere.position)
tween2.to({ x: -4 }, 1000)
tween2.onUpdate(() => {
  console.log(sphere.position.x)
})
tween.chain(tween2)
tween2.chain(tween)

// 设置相机位置
camera.position.z = 10
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
  // 开始记录性能
  stats.begin()

  controls.update()

  requestAnimationFrame(animate)

  // 渲染
  renderer.render(scene, camera)

  // 更新 Tween
  TWEEN.update()

  // 结束记录性能
  stats.end()
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
