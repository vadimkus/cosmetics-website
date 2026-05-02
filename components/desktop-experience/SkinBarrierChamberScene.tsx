'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Html, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'

type ChamberChapter = 'inspect' | 'science' | 'routine' | 'buy'

interface SkinBarrierChamberSceneProps {
  activeChapter: ChamberChapter
}

const chapterColors: Record<ChamberChapter, string> = {
  inspect: '#fb7185',
  science: '#38bdf8',
  routine: '#34d399',
  buy: '#fbbf24',
}

function SkinBarrierTube({ activeChapter }: SkinBarrierChamberSceneProps) {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    const chapterBoost = activeChapter === 'inspect' ? 0.18 : 0.08
    groupRef.current.rotation.y = clock.elapsedTime * chapterBoost + pointer.x * 0.38
    groupRef.current.rotation.x = -0.08 + pointer.y * 0.12
  })

  return (
    <Float speed={1.05} rotationIntensity={0.1} floatIntensity={0.25}>
      <group ref={groupRef} position={[-0.15, -0.02, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.58, 0.76, 3.05, 128]} />
          <meshPhysicalMaterial
            color="#fff7f2"
            roughness={0.35}
            metalness={0.02}
            clearcoat={0.7}
            clearcoatRoughness={0.2}
            emissive="#7f1d1d"
            emissiveIntensity={activeChapter === 'science' ? 0.05 : 0.02}
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -1.55, 0]}>
          <cylinderGeometry args={[0.79, 0.79, 0.44, 128]} />
          <meshStandardMaterial color="#0f172a" roughness={0.32} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.25, 0.594]}>
          <planeGeometry args={[0.92, 1.58]} />
          <meshStandardMaterial color="#ffffff" roughness={0.58} />
        </mesh>
        <Text position={[0, 0.78, 0.61]} fontSize={0.12} color="#111827" anchorX="center" anchorY="middle">
          GENOSYS
        </Text>
        <Text position={[0, 0.4, 0.61]} fontSize={0.075} color="#b91c1c" anchorX="center" anchorY="middle" maxWidth={0.72}>
          SKIN BARRIER
        </Text>
        <Text position={[0, 0.14, 0.61]} fontSize={0.045} color="#4b5563" anchorX="center" anchorY="middle" maxWidth={0.72}>
          PROTECTING CREAM
        </Text>
      </group>
    </Float>
  )
}

function BarrierMembrane({ activeChapter }: SkinBarrierChamberSceneProps) {
  const groupRef = useRef<Group>(null)
  const membraneRef = useRef<Mesh>(null)
  const accent = chapterColors[activeChapter]

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -clock.elapsedTime * 0.12
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.34) * 0.05
    }

    if (membraneRef.current) {
      membraneRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.2) * 0.018)
    }
  })

  return (
    <group ref={groupRef} position={[0.05, 0.08, -0.35]}>
      <mesh ref={membraneRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.018, 16, 220]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.65} />
      </mesh>
      <mesh rotation={[Math.PI / 2.25, 0.42, 0.25]}>
        <torusGeometry args={[2.08, 0.009, 16, 220]} />
        <meshStandardMaterial color="#fecaca" emissive="#fb7185" emissiveIntensity={0.22} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.2, -0.45]}>
        <sphereGeometry args={[1.55, 64, 64]} />
        <meshStandardMaterial color="#fff1f2" transparent opacity={0.18} roughness={0.85} />
      </mesh>
    </group>
  )
}

function IngredientParticles({ activeChapter }: SkinBarrierChamberSceneProps) {
  const ref = useRef<Group>(null)
  const accent = chapterColors[activeChapter]
  const nodes = useMemo(
    () => [
      [-1.6, 0.85, 0.2, 'Ceramides'],
      [1.55, 0.64, -0.1, 'Hydration'],
      [1.2, -0.92, 0.15, 'Recovery'],
      [-1.45, -0.72, -0.15, 'Comfort'],
    ] as const,
    []
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.08
  })

  return (
    <group ref={ref}>
      {nodes.map(([x, y, z, label], index) => (
        <group key={label} position={[x, y, z]}>
          <mesh castShadow>
            <sphereGeometry args={[index === 0 ? 0.13 : 0.105, 32, 32]} />
            <meshStandardMaterial color={index === 0 ? accent : '#fecaca'} emissive={accent} emissiveIntensity={0.28} roughness={0.3} />
          </mesh>
          <Html position={[0, 0.25, 0]} center distanceFactor={7.2} className="pointer-events-none">
            <div className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
              {label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function ChapterCallout({ activeChapter }: SkinBarrierChamberSceneProps) {
  const content: Record<ChamberChapter, { title: string; body: string }> = {
    inspect: {
      title: 'Inspect the product',
      body: 'Prepared for real GLB + 36-frame spin assets.',
    },
    science: {
      title: 'Barrier science',
      body: 'A repair-focused chamber for hydration and sensitive skin.',
    },
    routine: {
      title: 'Routine path',
      body: 'Cleanse, hydrate, seal, protect. Built for post-procedure comfort.',
    },
    buy: {
      title: 'Commerce layer',
      body: 'Purchase controls stay stable below the chamber.',
    },
  }

  return (
    <Html position={[1.85, 1.22, 0]} transform distanceFactor={7.2} className="pointer-events-none">
      <div className="w-[220px] rounded-2xl border border-white/25 bg-white/80 px-4 py-3 text-xs text-gray-700 shadow-2xl backdrop-blur-md">
        <div className="font-semibold text-gray-950">{content[activeChapter].title}</div>
        <div className="mt-1 leading-5">{content[activeChapter].body}</div>
      </div>
    </Html>
  )
}

export default function SkinBarrierChamberScene({ activeChapter }: SkinBarrierChamberSceneProps) {
  const accent = chapterColors[activeChapter]

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.6], fov: 39 }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.72} />
        <directionalLight position={[3.5, 4.2, 5]} intensity={2.35} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3, 1.8, 2]} intensity={1} color="#fecaca" />
        <pointLight position={[2.8, -1.4, 2.2]} intensity={0.85} color={accent} />
        <BarrierMembrane activeChapter={activeChapter} />
        <IngredientParticles activeChapter={activeChapter} />
        <SkinBarrierTube activeChapter={activeChapter} />
        <ChapterCallout activeChapter={activeChapter} />
        <Sparkles count={72} scale={[4.8, 3.2, 2.4]} size={2.1} speed={0.3} color={accent} />
        <ContactShadows position={[0, -1.82, 0]} opacity={0.38} scale={4.6} blur={2.8} far={2.4} />
        <Environment preset="studio" />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.22} intensity={0.38} mipmapBlur />
          <Vignette eskil={false} offset={0.18} darkness={0.62} />
        </EffectComposer>
        <OrbitControls enablePan={false} enableZoom minDistance={4.6} maxDistance={6.8} rotateSpeed={0.38} />
      </Suspense>
    </Canvas>
  )
}

export type { ChamberChapter }
