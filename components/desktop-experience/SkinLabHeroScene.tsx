'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Sparkles, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { DoubleSide, MeshBasicMaterial } from 'three'
import type { Group, Material, Mesh, Object3D, Texture } from 'three'

const FACE_MODEL_PATH = '/models/desktop-experience/genosys-athlete-face-hero-real-optimized.glb?v=clean-lady-face'

function FloatingMolecules() {
  const moleculeRef = useRef<Group>(null)
  const moleculeNodes: Array<[number, number, number]> = [
    [-2.1, 0.9, -0.2],
    [-1.72, 1.14, -0.05],
    [-1.45, 0.72, 0.05],
    [1.72, -0.12, -0.05],
    [2.05, 0.12, 0.08],
    [2.28, -0.28, -0.12],
  ]

  useFrame(({ clock }) => {
    if (moleculeRef.current) {
      moleculeRef.current.rotation.y = -clock.elapsedTime * 0.12
      moleculeRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.35) * 0.04
    }
  })

  return (
    <group ref={moleculeRef}>
      {moleculeNodes.map(([x, y, z], index) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]} castShadow>
          <sphereGeometry args={[index % 3 === 0 ? 0.12 : 0.075, 32, 32]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#ef4444' : '#fda4af'} roughness={0.28} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh === true
}

type TexturedMaterial = Material & { map?: Texture | null }

function materialWithMap(material: Material | Material[]): TexturedMaterial | null {
  const firstMaterial = Array.isArray(material) ? material[0] : material
  if (!firstMaterial) return null
  return 'map' in firstMaterial ? (firstMaterial as TexturedMaterial) : null
}

function AthleteFaceModel() {
  const faceRef = useRef<Group>(null)
  const { scene } = useGLTF(FACE_MODEL_PATH)
  const model = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    model.traverse((object) => {
      if (!isMesh(object)) return
      object.castShadow = true
      object.receiveShadow = true

      const texturedMaterial = materialWithMap(object.material)
      if (texturedMaterial?.map) {
        object.material = new MeshBasicMaterial({
          map: texturedMaterial.map,
          side: DoubleSide,
          toneMapped: false,
        })
      }
    })
  }, [model])

  useFrame(({ clock, pointer }) => {
    if (!faceRef.current) return
    faceRef.current.rotation.y = pointer.x * 0.035 + Math.sin(clock.elapsedTime * 0.45) * 0.01
    faceRef.current.rotation.x = pointer.y * 0.015
  })

  return (
    <group ref={faceRef} position={[0, 0, 0.08]}>
      <primitive object={model} />
    </group>
  )
}

export default function SkinLabHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 5.2], fov: 38 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.58} />
      <directionalLight position={[3.2, 4.5, 4.5]} intensity={1.25} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3.2, 1.8, 2.2]} intensity={0.5} color="#fecaca" />
      <pointLight position={[2.8, -0.4, 2.4]} intensity={0.24} color="#ffffff" />
      <mesh position={[0, 0, -1.65]} rotation={[0, 0, -0.1]}>
        <torusGeometry args={[1.88, 0.01, 16, 180]} />
        <meshStandardMaterial color="#fecdd3" roughness={0.5} transparent opacity={0.62} emissive="#fecdd3" emissiveIntensity={0.12} />
      </mesh>
      <Sparkles count={40} scale={[4.6, 2.6, 2]} size={1.35} speed={0.18} color="#fda4af" />
      <FloatingMolecules />
      <Suspense fallback={null}>
        <AthleteFaceModel />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 2.55}
        maxPolarAngle={Math.PI / 1.9}
        rotateSpeed={0.42}
      />
    </Canvas>
  )
}

useGLTF.preload(FACE_MODEL_PATH)
