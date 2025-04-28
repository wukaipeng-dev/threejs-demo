import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

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

// 纹理加载器
const textureLoader = new THREE.TextureLoader()
// 加载贴图
const map = textureLoader.load('/texture/watercover/CityNewYork002_COL_VAR1_1K.png')
// 加载 ao 贴图
const aoMap = textureLoader.load('/texture/watercover/CityNewYork002_AO_1K.jpg')
// 透明度贴图
const alphaMap = textureLoader.load('/texture/door/height.jpg')
// 光照贴图
const lightMap = textureLoader.load('/texture/colors.png')
// 高光贴图
const specularMap = textureLoader.load('/texture/watercover/CityNewYork002_GLOSS_1K.jpg')

const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  // 添加纹理贴图
  map: map,
  // 允许透明度
  transparent: true,
  // 设置 ao 贴图
  aoMap,
  // // 设置透明度贴图
  // alphaMap,
  // // 设置光照贴图
  // lightMap,
  // 设置高光贴图
  specularMap,
})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)

// 加载 hdr 贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
  // 设置环境贴图
  scene.background = envMap
  // 设置环境贴图的映射方式
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置 plane 的反射贴图
  planeMaterial.envMap = envMap
  // 设置 plane 的反射贴图的强度
  planeMaterial.reflectivity = 0.5
})

scene.add(plane)

// 创建 gui
const gui = new GUI()
// 创建一个按钮
gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).step(0.01).name('aoMapIntensity')


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

