import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

const outputPath = resolve('public/models/desktop-experience/genosys-athlete-face-bust.glb')

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class NodeFileReader {
    result = null
    error = null
    onloadend = null
    onerror = null

    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buffer) => {
          this.result = buffer
          this.onloadend?.({ target: this })
        })
        .catch((error) => {
          this.error = error
          this.onerror?.(error)
        })
    }
  }
}

function material(type, params) {
  if (type === 'physical') {
    return new THREE.MeshPhysicalMaterial(params)
  }
  return new THREE.MeshStandardMaterial(params)
}

function mesh(name, geometry, mat, { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] } = {}) {
  const item = new THREE.Mesh(geometry, mat)
  item.name = name
  item.castShadow = true
  item.receiveShadow = true
  item.position.set(...position)
  item.rotation.set(...rotation)
  item.scale.set(...scale)
  return item
}

const skin = material('physical', {
  color: '#efb096',
  roughness: 0.42,
  clearcoat: 0.34,
  clearcoatRoughness: 0.48,
})
const skinDark = material('physical', {
  color: '#e5a087',
  roughness: 0.52,
  clearcoat: 0.18,
})
const neckSkin = material('physical', {
  color: '#e8a78f',
  roughness: 0.48,
  clearcoat: 0.26,
  clearcoatRoughness: 0.56,
})
const hair = material('standard', { color: '#25150f', roughness: 0.62 })
const white = material('standard', { color: '#fff8f5', roughness: 0.26 })
const iris = material('standard', { color: '#64a3d8', roughness: 0.18, metalness: 0.04 })
const pupil = material('standard', { color: '#0f172a', roughness: 0.16 })
const brow = material('standard', { color: '#3a2118', roughness: 0.62 })
const nose = material('physical', { color: '#e29d85', roughness: 0.46, clearcoat: 0.22 })
const nostril = material('standard', { color: '#8b4b3e', roughness: 0.5 })
const lipTop = material('standard', { color: '#cf6f72', roughness: 0.34 })
const lipBottom = material('standard', { color: '#e08b87', roughness: 0.36 })
const blush = material('standard', { color: '#f4a9a5', roughness: 0.5, transparent: true, opacity: 0.28 })

const root = new THREE.Group()
root.name = 'GENOSYS_Athletic_Face_Bust'
root.userData = {
  source: 'Reference-driven procedural GLB prototype',
  references: [
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-00-front.png',
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-30-left.png',
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-30-right.png',
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-profile-left.png',
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-profile-right.png',
    '/images/desktop-experience/face-references/genosys-athlete-face-ref-back.png',
  ],
}

root.add(
  mesh('neck', new THREE.CylinderGeometry(0.22, 0.34, 0.85, 48), neckSkin, {
    position: [0, -0.95, -0.02],
  })
)
root.add(
  mesh('shoulders', new THREE.SphereGeometry(1, 64, 32), skinDark, {
    position: [0, -1.42, -0.08],
    scale: [1.55, 0.34, 0.44],
  })
)

const head = new THREE.Group()
head.name = 'head'
head.position.set(0, 0.18, 0)
root.add(head)

head.add(mesh('face_shape', new THREE.SphereGeometry(1, 96, 96), skin, { scale: [0.72, 1.02, 0.52] }))
head.add(
  mesh('hair_cap', new THREE.SphereGeometry(1, 96, 96), hair, {
    position: [0, 0.2, -0.18],
    scale: [0.78, 1.06, 0.5],
  })
)
head.add(
  mesh('hair_bun_top', new THREE.SphereGeometry(1, 48, 32), hair, {
    position: [0, 0.78, -0.22],
    scale: [0.42, 0.18, 0.28],
  })
)
head.add(
  mesh('hair_bun_side', new THREE.SphereGeometry(1, 48, 32), hair, {
    position: [0.5, 0.55, -0.28],
    scale: [0.22, 0.35, 0.2],
  })
)
head.add(
  mesh('left_ear', new THREE.SphereGeometry(1, 32, 32), neckSkin, {
    position: [-0.72, 0.1, 0.02],
    scale: [0.12, 0.25, 0.08],
  })
)
head.add(
  mesh('right_ear', new THREE.SphereGeometry(1, 32, 32), neckSkin, {
    position: [0.72, 0.1, 0.02],
    scale: [0.12, 0.25, 0.08],
  })
)

const features = new THREE.Group()
features.name = 'front_features'
features.position.set(0, 0, 0.5)
head.add(features)

features.add(mesh('left_eye_white', new THREE.SphereGeometry(1, 48, 24), white, { position: [-0.25, 0.24, 0.04], scale: [0.15, 0.055, 0.03] }))
features.add(mesh('right_eye_white', new THREE.SphereGeometry(1, 48, 24), white, { position: [0.25, 0.24, 0.04], scale: [0.15, 0.055, 0.03] }))
features.add(mesh('left_blue_iris', new THREE.SphereGeometry(1, 32, 16), iris, { position: [-0.25, 0.24, 0.078], scale: [0.052, 0.052, 0.018] }))
features.add(mesh('right_blue_iris', new THREE.SphereGeometry(1, 32, 16), iris, { position: [0.25, 0.24, 0.078], scale: [0.052, 0.052, 0.018] }))
features.add(mesh('left_pupil', new THREE.SphereGeometry(1, 24, 12), pupil, { position: [-0.25, 0.24, 0.102], scale: [0.022, 0.022, 0.01] }))
features.add(mesh('right_pupil', new THREE.SphereGeometry(1, 24, 12), pupil, { position: [0.25, 0.24, 0.102], scale: [0.022, 0.022, 0.01] }))

features.add(
  mesh('left_brow', new THREE.CylinderGeometry(0.01, 0.01, 0.32, 12), brow, {
    position: [-0.25, 0.38, 0.03],
    rotation: [0, 0, Math.PI / 2 - 0.08],
  })
)
features.add(
  mesh('right_brow', new THREE.CylinderGeometry(0.01, 0.01, 0.32, 12), brow, {
    position: [0.25, 0.38, 0.03],
    rotation: [0, 0, Math.PI / 2 + 0.08],
  })
)
features.add(mesh('nose_bridge', new THREE.SphereGeometry(1, 48, 32), nose, { position: [0, 0.02, 0.03], scale: [0.095, 0.26, 0.08] }))
features.add(mesh('left_nostril', new THREE.SphereGeometry(1, 16, 12), nostril, { position: [-0.055, -0.16, 0.095], scale: [0.025, 0.012, 0.012] }))
features.add(mesh('right_nostril', new THREE.SphereGeometry(1, 16, 12), nostril, { position: [0.055, -0.16, 0.095], scale: [0.025, 0.012, 0.012] }))
features.add(mesh('upper_lip', new THREE.SphereGeometry(1, 48, 24), lipTop, { position: [0, -0.36, 0.07], scale: [0.24, 0.042, 0.028] }))
features.add(mesh('lower_lip', new THREE.SphereGeometry(1, 48, 24), lipBottom, { position: [0, -0.43, 0.068], scale: [0.21, 0.052, 0.026] }))
features.add(mesh('left_cheek_glow', new THREE.SphereGeometry(1, 32, 16), blush, { position: [-0.42, -0.08, 0.025], scale: [0.12, 0.055, 0.018] }))
features.add(mesh('right_cheek_glow', new THREE.SphereGeometry(1, 32, 16), blush, { position: [0.42, -0.08, 0.025], scale: [0.12, 0.055, 0.018] }))

const exporter = new GLTFExporter()
const arrayBuffer = await exporter.parseAsync(root, { binary: true })

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, Buffer.from(arrayBuffer))
console.log(`Generated ${outputPath}`)
