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

// 创建一个长方体
const geometry = new THREE.BoxGeometry(1, 1, 100)
// 创建一个材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
})
// 创建一个网格
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// 创建 fog
// const fog = new THREE.Fog(0x999999, 1, 50)
const fog = new THREE.FogExp2(0x999999, 0.1)
scene.fog = fog
scene.background = new THREE.Color(0x999999)

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
