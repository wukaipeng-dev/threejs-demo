import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stats from 'stats.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入顶点法线辅助器
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

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

// 加载贴图
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/texture/uv_grid_opengl.jpg')

// 创建一个几何平面
const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = -2
console.log(planeGeometry.attributes)
scene.add(plane)

// 创建和上面 planeGeometry 尺寸一样的几何平面
const planeGeometry2 = new THREE.BufferGeometry()
const vertices = new Float32Array([
  -1, -1, 0,
  1, -1, 0,
  1, 1, 0,
  -1, 1, 0,
])
planeGeometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const indices = new Uint16Array([0, 1, 2, 0, 2, 3])
planeGeometry2.setIndex(new THREE.BufferAttribute(indices, 1))
const planeMaterial2 = new THREE.MeshBasicMaterial({ map: texture })
const plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2)
// plane2.position.x = 2
plane2.geometry.translate(10, 0, 0)
console.log(planeGeometry2.attributes)
scene.add(plane2)

// 设置 uv 坐标
const uv = new Float32Array([
  0, 0,
  1, 0,
  1, 1,
  0, 1,
])
planeGeometry2.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

// 设置法线
const normal = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
])
planeGeometry2.setAttribute('normal', new THREE.BufferAttribute(normal, 3))

// 设置顶点法线辅助器
const vertexNormalsHelper = new VertexNormalsHelper(plane2, 1)
scene.add(vertexNormalsHelper)

// 加载背景贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  planeMaterial.envMap = texture
  planeMaterial2.envMap = texture
})

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
