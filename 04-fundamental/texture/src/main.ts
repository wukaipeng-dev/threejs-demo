
import * as THREE from 'three'

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

const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)

// 创建材质
const materials = [
  '/images/flower-1.jpg',
  '/images/flower-2.jpg',
  '/images/flower-3.jpg',
  '/images/flower-4.jpg',
  '/images/flower-5.jpg',
  '/images/flower-6.jpg',
].map(url => {
  const texture = loader.load(url)
  return new THREE.MeshBasicMaterial({ map: texture })
})

let cube: THREE.Mesh

loadManager.onLoad = () => {
  console.log('加载完成')
  // 创建几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // 创建网格
  cube = new THREE.Mesh(geometry, materials)
  // 将几何体添加到场景中
  scene.add(cube)
}


// 设置相机位置
camera.position.z = 5
camera.lookAt(0, 0, 0)

// 渲染
function animate() {
  requestAnimationFrame(animate)
  if (cube) {
    // 旋转
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }
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