'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import type { Group } from 'three'

interface ProductLabSceneProps {
  productName: string
  isSkinBarrier?: boolean | undefined
}

function ProductModel({ productName, isSkinBarrier }: ProductLabSceneProps) {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.elapsedTime * 0.22 + pointer.x * 0.45
    groupRef.current.rotation.x = pointer.y * 0.16
  })

  const label = isSkinBarrier ? 'SKIN BARRIER' : productName.split(' ').slice(0, 2).join(' ').toUpperCase()

  return (
    <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.32}>
      <group ref={groupRef} position={[0, 0.05, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.64, 0.78, 2.85, 96]} />
          <meshPhysicalMaterial color="#fff7f2" roughness={0.42} metalness={0.02} clearcoat={0.55} clearcoatRoughness={0.28} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -1.48, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.42, 96]} />
          <meshStandardMaterial color="#111827" roughness={0.34} metalness={0.16} />
        </mesh>
        <mesh position={[0, 0.24, 0.652]}>
          <planeGeometry args={[0.94, 1.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.58} />
        </mesh>
        <Text
          position={[0, 0.74, 0.668]}
          fontSize={0.12}
          color="#111827"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.78}
        >
          GENOSYS
        </Text>
        <Text
          position={[0, 0.35, 0.668]}
          fontSize={0.072}
          color="#b91c1c"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.72}
        >
          {label}
        </Text>
        <Text
          position={[0, 0.08, 0.668]}
          fontSize={0.045}
          color="#4b5563"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.72}
        >
          DESKTOP 3D PREVIEW
        </Text>
      </group>
    </Float>
  )
}

function MeasurementRings() {
  const ringRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.elapsedTime * -0.15
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.45) * 0.06
    }
  })

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.01, 12, 160]} />
        <meshStandardMaterial color="#fb7185" emissive="#7f1d1d" emissiveIntensity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.5, 0.35]}>
        <torusGeometry args={[1.88, 0.008, 12, 160]} />
        <meshStandardMaterial color="#fecaca" emissive="#7f1d1d" emissiveIntensity={0.16} />
      </mesh>
    </group>
  )
}

export default function ProductLabScene({ productName, isSkinBarrier }: ProductLabSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.18, 5.3], fov: 40 }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3, 2, 2]} intensity={0.75} color="#fecaca" />
        <Sparkles count={42} scale={[3.8, 2.8, 2]} size={2} speed={0.28} color="#fb7185" />
        <MeasurementRings />
        <ProductModel productName={productName} isSkinBarrier={isSkinBarrier} />
        <ContactShadows position={[0, -1.78, 0]} opacity={0.35} scale={4.2} blur={2.6} far={2.4} />
        <Environment preset="studio" />
        <OrbitControls enablePan={false} enableZoom minDistance={4.4} maxDistance={6.6} rotateSpeed={0.45} />
      </Suspense>
    </Canvas>
  )
}
