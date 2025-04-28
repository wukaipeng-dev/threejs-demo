import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stats from 'stats.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

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

// 创建三个不同颜色的球体
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32) // 复用几何体
const spheres = [
  { color: 0x00ff00, position: -3 }, // 左侧绿色
  { color: 0x0000ff, position: 0 }, // 中间蓝色
  { color: 0xff0000, position: 3 }, // 右侧红色
].map(({ color, position }) => {
  const material = new THREE.MeshBasicMaterial({ color })
  const sphere = new THREE.Mesh(sphereGeometry, material)
  sphere.position.x = position
  scene.add(sphere)
  return sphere
})

// 创建光线投射
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 当鼠标点击时，改变球体的颜色
window.addEventListener('click', (event) => {
  // 将鼠标位置归一化为设备坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(spheres)

  if (intersects.length > 0) {
    for (const intersect of intersects) {
      const sphere = intersect.object as THREE.Mesh
      const material = sphere.material as THREE.MeshBasicMaterial

      if (material._isSelected) {
        material.color.set(material._originalColor)
        material._isSelected = false
      } else {
        // 保存原始颜色
        const originalColor = material.color.clone()
        material._originalColor = originalColor
        material.color.set(0x000000)
        // 保存选中状态
        material._isSelected = true
      }
    }
  }
})

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
