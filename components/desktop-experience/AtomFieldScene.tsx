'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ACESFilmicToneMapping } from 'three'
import type { Group } from 'three'

/**
 * A field of small glassy atoms drifting in 3D around the static portrait.
 * Each atom has its own slow orbit + cursor parallax, so the layer feels
 * genuinely 3D over the 2D hero photo. Sized small + translucent on purpose:
 * the photo carries the subject; the atoms add motion and depth.
 */

interface AtomSeed {
  basePosition: [number, number, number]
  radius: number
  color: string
  orbitSpeed: number
  orbitRadius: number
  orbitPhase: number
  parallax: number
  emissive: string
}

const TINTS = [
  '#fda4af',
  '#fb7185',
  '#fecdd3',
  '#ffe4e6',
  '#fff1f2',
  '#ffffff',
] as const

// Deterministic PRNG so render is consistent across SSR/CSR re-runs
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateAtoms(count: number, randomSeed: number): AtomSeed[] {
  const rand = mulberry32(randomSeed)
  const atoms: AtomSeed[] = []
  for (let i = 0; i < count; i++) {
    // Bias 70% to the left half (where the photo has negative space) and 30%
    // to the right side (mostly behind / off the face), but never directly
    // on top of the face (avoid the central x ∈ [0.2, 1.8] band at z >= 0.4).
    const leftBias = rand() < 0.7
    let x: number
    if (leftBias) {
      x = -(0.3 + rand() * 2.0)
    } else {
      x = 0.3 + rand() * 1.9
    }
    const y = (rand() - 0.5) * 2.6
    const z = (rand() - 0.5) * 1.6 - 0.1

    const radius = 0.045 + Math.pow(rand(), 1.6) * 0.16
    const color = TINTS[Math.floor(rand() * TINTS.length)] ?? '#fda4af'
    atoms.push({
      basePosition: [x, y, z],
      radius,
      color,
      orbitSpeed: 0.08 + rand() * 0.3,
      orbitRadius: 0.12 + rand() * 0.45,
      orbitPhase: rand() * Math.PI * 2,
      // Bigger atoms travel farther on cursor parallax (front-of-stage feel)
      parallax: 0.35 + rand() * 0.85 + radius * 1.4,
      emissive: color,
    })
  }
  return atoms
}

function Atom({ seed }: { seed: AtomSeed }) {
  const ref = useRef<Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * seed.orbitSpeed + seed.orbitPhase
    const ox = Math.cos(t) * seed.orbitRadius
    const oy = Math.sin(t * 0.7) * seed.orbitRadius * 0.7
    const oz = Math.sin(t) * seed.orbitRadius * 0.6
    ref.current.position.set(
      seed.basePosition[0] + ox + pointer.x * seed.parallax,
      seed.basePosition[1] + oy + pointer.y * seed.parallax * 0.85,
      seed.basePosition[2] + oz + pointer.x * seed.parallax * 0.25,
    )
  })

  return (
    <group ref={ref}>
      <mesh castShadow>
        <sphereGeometry args={[seed.radius, 24, 24]} />
        <meshPhysicalMaterial
          color={seed.color}
          metalness={0.05}
          roughness={0.16}
          transmission={0.65}
          thickness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.45}
          attenuationColor={seed.color}
          attenuationDistance={1.4}
          emissive={seed.emissive}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  )
}

export default function AtomFieldScene() {
  // Stable seed -> stable layout per session.
  const atoms = useMemo(() => generateAtoms(38, 7341), [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={0.95} color="#fff5f0" />
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#ffd6cf" />
      <pointLight position={[0, 0, 4]} intensity={0.45} color="#ffffff" />

      {atoms.map((seed, i) => (
        <Atom key={i} seed={seed} />
      ))}
    </Canvas>
  )
}
