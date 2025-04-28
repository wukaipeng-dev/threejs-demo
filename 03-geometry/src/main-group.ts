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
const geometry = new THREE.BufferGeometry()
// 使用索引
const vertices = new Float32Array([
  1.0, 1.0, 0.0,
  -1.0, -1.0, 0.0,
  1.0, -1.0, 0.0,
  -1.0, 1.0, 0.0,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const indices = new Uint16Array([
  0, 1, 2,
  0, 3, 1,
])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置 2 个顶点组，形成 2 个材质
geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)

// 创建材质
const material1 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  // wireframe: true,
})
const material2 = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
  // wireframe: true,
})

// 创建网格
const mesh = new THREE.Mesh(geometry, [material1, material2])
// 添加到场景
scene.add(mesh)

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
