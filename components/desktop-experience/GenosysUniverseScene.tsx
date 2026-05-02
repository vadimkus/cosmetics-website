'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Html, OrbitControls, Sparkles } from '@react-three/drei'
import Link from 'next/link'
import { Suspense, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Color, Vector3 } from 'three'
import type { Group } from 'three'

interface UniverseSceneZone {
  id: string
  href: string
  title: string
  signal: string
  accent: string
  scenePosition: [number, number, number]
}

interface GenosysUniverseSceneProps {
  zones: UniverseSceneZone[]
}

function Bond({ from, to, color = '#fecaca' }: { from: Vector3; to: Vector3; color?: string }) {
  const curve = useMemo(() => new CatmullRomCurve3([from, to]), [from, to])

  return (
    <mesh>
      <tubeGeometry args={[curve, 16, 0.012, 8, false]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.42} />
    </mesh>
  )
}

function MolecularSkinLabCore() {
  const coreRef = useRef<Group>(null)
  const haloRef = useRef<Group>(null)
  const moleculeNodes = useMemo(
    () => [
      { position: new Vector3(0, 0.18, 0.24), radius: 0.2, color: '#fb7185' },
      { position: new Vector3(0.52, 0.45, 0.05), radius: 0.13, color: '#e0f2fe' },
      { position: new Vector3(-0.54, 0.32, 0.1), radius: 0.14, color: '#fecaca' },
      { position: new Vector3(0.08, -0.36, 0.18), radius: 0.15, color: '#bae6fd' },
      { position: new Vector3(0.64, -0.18, -0.02), radius: 0.1, color: '#fda4af' },
      { position: new Vector3(-0.64, -0.16, -0.02), radius: 0.1, color: '#fed7aa' },
    ],
    []
  )
  const helixA = useMemo(
    () =>
      new CatmullRomCurve3(
        Array.from({ length: 48 }, (_, index) => {
          const t = (index / 47) * Math.PI * 4
          return new Vector3(Math.cos(t) * 0.58, (index / 47 - 0.5) * 1.75, Math.sin(t) * 0.16 - 0.2)
        })
      ),
    []
  )
  const helixB = useMemo(
    () =>
      new CatmullRomCurve3(
        Array.from({ length: 48 }, (_, index) => {
          const t = (index / 47) * Math.PI * 4 + Math.PI
          return new Vector3(Math.cos(t) * 0.58, (index / 47 - 0.5) * 1.75, Math.sin(t) * 0.16 - 0.2)
        })
      ),
    []
  )

  useFrame(({ clock, pointer }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.16
      coreRef.current.rotation.x = pointer.y * 0.06
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = clock.elapsedTime * 0.035
      haloRef.current.rotation.y = -clock.elapsedTime * 0.08
    }
  })

  return (
    <group>
      <group ref={haloRef}>
        <mesh rotation={[Math.PI / 2.08, 0, 0]}>
          <torusGeometry args={[1.88, 0.01, 16, 220]} />
          <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.85} transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[Math.PI / 2.24, 0.62, 0.28]}>
          <torusGeometry args={[2.28, 0.006, 16, 240]} />
          <meshStandardMaterial color="#fecaca" emissive="#fb7185" emissiveIntensity={0.32} transparent opacity={0.58} />
        </mesh>
        <mesh rotation={[Math.PI / 2.42, -0.4, -0.18]}>
          <torusGeometry args={[2.66, 0.004, 12, 240]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.22} />
        </mesh>
      </group>

      <Float speed={0.72} rotationIntensity={0.05} floatIntensity={0.16}>
        <group ref={coreRef} position={[0, 0.02, 0]}>
          <group position={[0, 0.08, 0.05]}>
            <mesh>
              <tubeGeometry args={[helixA, 96, 0.012, 8, false]} />
              <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.34} roughness={0.35} />
            </mesh>
            <mesh>
              <tubeGeometry args={[helixB, 96, 0.012, 8, false]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.28} roughness={0.35} />
            </mesh>
          </group>

          {moleculeNodes.map(node => (
            <mesh key={`${node.position.x}-${node.position.y}-${node.position.z}`} position={node.position} castShadow>
              <sphereGeometry args={[node.radius, 64, 48]} />
              <meshPhysicalMaterial
                color={node.color}
                roughness={0.18}
                metalness={0.04}
                clearcoat={0.95}
                clearcoatRoughness={0.12}
                emissive={node.color}
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}

          <Bond from={moleculeNodes[0]!.position} to={moleculeNodes[1]!.position} color="#fecaca" />
          <Bond from={moleculeNodes[0]!.position} to={moleculeNodes[2]!.position} color="#fecaca" />
          <Bond from={moleculeNodes[0]!.position} to={moleculeNodes[3]!.position} color="#fecaca" />
          <Bond from={moleculeNodes[3]!.position} to={moleculeNodes[4]!.position} color="#bae6fd" />
          <Bond from={moleculeNodes[3]!.position} to={moleculeNodes[5]!.position} color="#fed7aa" />

          <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2.18, 0, 0]}>
            <torusGeometry args={[1.2, 0.018, 16, 220]} />
            <meshStandardMaterial color="#fecaca" emissive="#fb7185" emissiveIntensity={0.16} transparent opacity={0.62} roughness={0.52} />
          </mesh>
          <mesh position={[0, -1.02, 0]} rotation={[Math.PI / 2.14, 0.18, 0]}>
            <torusGeometry args={[1.04, 0.012, 16, 220]} />
            <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.12} transparent opacity={0.42} roughness={0.58} />
          </mesh>
          <mesh position={[0, -1.14, 0]} rotation={[Math.PI / 2.1, -0.18, 0]}>
            <torusGeometry args={[0.88, 0.009, 16, 220]} />
            <meshStandardMaterial color="#fed7aa" emissive="#fb923c" emissiveIntensity={0.06} transparent opacity={0.28} roughness={0.64} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

function ZonePortal({ zone, index }: { zone: UniverseSceneZone; index: number }) {
  const groupRef = useRef<Group>(null)
  const [x, y, z] = zone.scenePosition

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.elapsedTime * 0.16 + index * 0.35
    groupRef.current.position.y = y + Math.sin(clock.elapsedTime * 0.9 + index) * 0.04
  })

  return (
    <group ref={groupRef} position={[x, y, z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={zone.accent} emissive={zone.accent} emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.006, 12, 90]} />
        <meshStandardMaterial color={zone.accent} emissive={zone.accent} emissiveIntensity={0.75} transparent opacity={0.78} />
      </mesh>
      <Html position={[0, 0.28, 0]} center distanceFactor={7.8} className="pointer-events-auto">
        <Link
          href={zone.href}
          aria-label={zone.title}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[11px] font-semibold text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:border-white/70 hover:bg-white/20"
        >
          {index + 1}
        </Link>
      </Html>
    </group>
  )
}

function OrbitLines() {
  const ref = useRef<Group>(null)
  const shells = useMemo(
    () => [
      [2.96, Math.PI / 2, 0, 0, '#ffffff', 0.1],
      [2.54, Math.PI / 2.18, 0.48, 0.18, '#fecaca', 0.2],
      [2.18, Math.PI / 2.36, -0.5, -0.2, '#fb7185', 0.24],
    ] as const,
    []
  )

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.024
    }
  })

  return (
    <group ref={ref}>
      {shells.map(([radius, rx, ry, rz, color, opacity]) => (
        <mesh key={`${radius}-${color}`} rotation={[rx, ry, rz]}>
          <torusGeometry args={[radius, 0.0035, 8, 240]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  )
}

export default function GenosysUniverseScene({ zones }: GenosysUniverseSceneProps) {
  return (
    <Canvas
      camera={{ position: [0.18, 0.06, 7.2], fov: 40 }}
      shadows
      dpr={[1.5, 2.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#03050a' }}
      onCreated={({ gl, scene }) => {
        const background = new Color('#03050a')
        gl.setClearColor(background, 1)
        scene.background = background
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#03050a']} />
        <ambientLight intensity={0.36} />
        <directionalLight position={[3.8, 4.8, 4.6]} intensity={2.35} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-3.2, 1.6, 2.6]} intensity={1.55} color="#fecaca" />
        <pointLight position={[2.8, -1.6, 1.8]} intensity={1.05} color="#38bdf8" />
        <pointLight position={[0, 0.2, 2.4]} intensity={1.15} color="#ffffff" />
        <group position={[1.2, 0.05, 0]} scale={0.9}>
          <OrbitLines />
          <MolecularSkinLabCore />
          {zones.map((zone, index) => (
            <ZonePortal key={zone.id} zone={zone} index={index} />
          ))}
          <Sparkles count={46} scale={[5.8, 3.4, 2.8]} size={1.25} speed={0.12} color="#fecaca" />
        </group>
        <Environment preset="night" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.75}
          maxPolarAngle={Math.PI / 1.92}
          rotateSpeed={0.24}
        />
      </Suspense>
    </Canvas>
  )
}
