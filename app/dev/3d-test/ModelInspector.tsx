'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Stats,
  useGLTF,
} from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  ACESFilmicToneMapping,
  Box3,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
} from 'three'
import type { Group, Mesh, Object3D } from 'three'

const CANDIDATE_MODELS = [
  '/models/desktop-experience/lady-head-real.glb',
  '/models/desktop-experience/genosys-athlete-face-hero-real-optimized.glb',
  '/models/desktop-experience/genosys-athlete-face-bust-final-optimized.glb',
]

function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh === true
}

function ModelView({
  src,
  autoRotate,
  framing,
}: {
  src: string
  autoRotate: boolean
  framing: 'head' | 'fit'
}) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(src)
  const model = useMemo(() => scene.clone(true), [scene])

  const transform = useMemo(() => {
    const box = new Box3().setFromObject(model)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const aspectTall = size.y / Math.max(size.x, size.z)
    const isFullFigure = size.y > 1.2 && aspectTall > 0.9

    const targetY = framing === 'head' && isFullFigure
      ? box.max.y - size.y * 0.07
      : center.y
    const framedHeight = framing === 'head' && isFullFigure ? size.y * 0.28 : size.y
    const framedWidth = framing === 'head' && isFullFigure ? size.x * 0.5 : size.x
    const longestFramed = Math.max(framedWidth, framedHeight, size.z) || 1
    const scale = 1.4 / longestFramed
    return { offset: new Vector3(-center.x, -targetY, -center.z), scale }
  }, [model, framing])

  useEffect(() => {
    model.traverse((object) => {
      if (!isMesh(object)) return
      object.castShadow = true
      object.receiveShadow = true
      const m = object.material as MeshStandardMaterial
      if (m && 'map' in m && m.map) {
        m.map.colorSpace = SRGBColorSpace
        m.map.anisotropy = 8
      }
      if (m instanceof MeshStandardMaterial) {
        if (m.roughness > 0.85) m.roughness = 0.55
        m.metalness = Math.min(m.metalness, 0.05)
        m.envMapIntensity = 0.9
      }
    })
  }, [model])

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group ref={groupRef} scale={transform.scale}>
      <group position={transform.offset.toArray()}>
        <primitive object={model} />
      </group>
    </group>
  )
}

export default function ModelInspector() {
  const [selected, setSelected] = useState<string>(CANDIDATE_MODELS[0]!)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [framing, setFraming] = useState<'head' | 'fit'>('fit')

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-xl border border-rose-100 bg-white/85 p-3 text-sm shadow-lg backdrop-blur">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Model</span>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs"
          >
            {CANDIDATE_MODELS.map((src) => (
              <option key={src} value={src}>
                {src.replace('/models/desktop-experience/', '')}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Framing</span>
          <select
            value={framing}
            onChange={(e) => setFraming(e.target.value as 'head' | 'fit')}
            className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs"
          >
            <option value="head">head/face (top of bbox)</option>
            <option value="fit">whole bust (center of bbox)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          auto-rotate
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
          />
          show stats
        </label>
        <p className="max-w-xs text-[11px] text-gray-500">
          Drag to orbit, scroll to zoom. If a file 404s, the loader will throw — pick the
          fallback or upload the real GLB.
        </p>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0.1, 2.4], fov: 30 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={["#fdf6f4"]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[2.8, 3.6, 3.4]}
          intensity={1.45}
          color="#fff5ec"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-2.6, 1.8, 2.1]} intensity={0.55} color="#ffd7cf" />

        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.7} />
          <ModelView src={selected} autoRotate={autoRotate} framing={framing} />
        </Suspense>

        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.45}
          scale={4}
          blur={2.2}
          far={2}
        />

        <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} />
        {showStats ? <Stats /> : null}
      </Canvas>
    </div>
  )
}
