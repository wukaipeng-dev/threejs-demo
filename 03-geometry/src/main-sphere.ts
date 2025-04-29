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

// 加载 gltf 模型
const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/Duck.glb', (gltf) => {
  scene.add(gltf.scene)

  // 获取 duck 模型
  const duckMesh = gltf.scene.getObjectByName('LOD3spShape') as THREE.Mesh
  const duckGeometry = duckMesh.geometry

  // 计算包围盒
  duckGeometry.computeBoundingBox()

  // 设置几何体居中
  // duckGeometry.center()

  // 更新 duck 模型的世界矩阵
  duckMesh.updateWorldMatrix(true, true)

  // 设置包围盒辅助器
  const duckBox = duckGeometry.boundingBox as THREE.Box3

  // 更新包围盒辅助器
  duckBox.applyMatrix4(duckMesh.matrixWorld)

  // 获取中心
  const center = duckBox.getCenter(new THREE.Vector3())
  console.log('center', center)

  const boxHelper = new THREE.Box3Helper(duckBox, 0x00ff00)
  scene.add(boxHelper)

  // 获取包围球
  const duckSphere = duckGeometry.boundingSphere as THREE.Sphere
  duckSphere.applyMatrix4(duckMesh.matrixWorld)
  // 创建包围球
  const duckSphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16)
  const duckSphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })
  const duckSphereMesh = new THREE.Mesh(duckSphereGeometry, duckSphereMaterial)
  duckSphereMesh.position.copy(center)
  scene.add(duckSphereMesh)
})

// // 加载 draco 模型
// const dracoLoader = new DRACOLoader()
// // 设置 draco 解码器路径
// dracoLoader.setDecoderPath('/draco/')
// // 设置 draco 加载器
// gltfLoader.setDRACOLoader(dracoLoader)
// gltfLoader.load('/model/city.glb', (gltf) => {
//   console.log(gltf)
//   scene.add(gltf.scene)
// })

// 加载 hdr 贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
  // 设置环境贴图
  scene.environment = envMap
  // 设置环境贴图的映射方式
  envMap.mapping = THREE.EquirectangularReflectionMapping
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
