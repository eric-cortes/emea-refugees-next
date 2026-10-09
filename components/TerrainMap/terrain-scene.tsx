'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type ComponentRef } from 'react'
import { invalidate, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { MathUtils, Vector3, type Group, type PerspectiveCamera } from 'three'
import type { Region } from '@/constants/regions'
import { projectLaea } from '@/utils/laea'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'
import { applyExaggeration, worldHeight, type TerrainGeometryData } from './build-terrain-geometry'
import { regionScale } from './region-scale'
import { sampleElevation, type HeightmapData } from './load-heightmap'

const DURATION_MS = 600
const RESET_DURATION_MS = 700
const BACKGROUND = '#2f3336'
const FIT_MARGIN = 1.06
const START_DIRECTION = new Vector3(0, 3, 1).normalize()

interface MarkerSpec {
  lat: number
  lng: number
  label: string
}

export interface ViewState {
  azimuth: number
  kmPerPixel: number
}

interface Props {
  terrain: TerrainGeometryData
  heightmap: HeightmapData
  region: Region
  exaggeration: number
  resetSignal: number
  marker: MarkerSpec
  onViewChange?: (view: ViewState) => void
}

interface Animation {
  from: number
  to: number
  start: number
}

interface ResetAnimation {
  fromPosition: Vector3
  fromTarget: Vector3
  start: number
}

function fitCamera(terrain: TerrainGeometryData, region: Region, fov: number, aspect: number) {
  const { heights, used, gridCount, bottomY } = terrain
  let max = 0
  let min = 0
  for (let v = 0; v < gridCount; v++) {
    if (!used[v]) continue
    if (heights[v] > max) max = heights[v]
    if (heights[v] < min) min = heights[v]
  }
  const top = worldHeight(max, region.exaggeration)
  const low = Math.min(bottomY, worldHeight(min, region.exaggeration))
  const centerY = (top + low) / 2
  const halfX = (region.width * region.metresPerPixel) / 2000
  const halfY = (top - low) / 2
  const halfZ = (region.height * region.metresPerPixel) / 2000

  const forward = START_DIRECTION.clone().negate()
  const right = new Vector3(1, 0, 0)
  const up = new Vector3().crossVectors(right, forward).normalize()
  const tanV = Math.tan(MathUtils.degToRad(fov) / 2)
  const tanH = tanV * aspect
  const corner = new Vector3()
  let distance = 0
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        corner.set(sx * halfX, sy * halfY, sz * halfZ)
        const depth = corner.dot(forward)
        const needed = Math.max(Math.abs(corner.dot(right)) / tanH, Math.abs(corner.dot(up)) / tanV) - depth
        if (needed > distance) distance = needed
      }
    }
  }
  return { distance: distance * FIT_MARGIN, centerY }
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export default function TerrainScene({ terrain, heightmap, region, exaggeration, resetSignal, marker, onViewChange }: Props) {
  const reducedMotion = usePrefersReducedMotion()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const markerGroup = useRef<Group>(null)
  const current = useRef(exaggeration)
  const animation = useRef<Animation | null>(null)
  const camera = useThree(state => state.camera) as PerspectiveCamera
  const size = useThree(state => state.size)
  const startPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const resetAnimation = useRef<ResetAnimation | null>(null)

  const onViewChangeRef = useRef(onViewChange)
  const lastView = useRef<ViewState | null>(null)
  useEffect(() => {
    onViewChangeRef.current = onViewChange
  }, [onViewChange])

  const reportView = useCallback(() => {
    const orbit = controls.current
    const callback = onViewChangeRef.current
    if (!orbit || !callback) return
    const azimuth = orbit.getAzimuthalAngle()
    const distance = camera.position.distanceTo(orbit.target)
    const kmPerPixel = (2 * distance * Math.tan(MathUtils.degToRad(camera.fov) / 2)) / Math.max(1, size.height)
    const last = lastView.current
    if (
      last &&
      Math.abs(azimuth - last.azimuth) <= MathUtils.degToRad(0.5) &&
      Math.abs(kmPerPixel - last.kmPerPixel) <= last.kmPerPixel * 0.005
    ) {
      return
    }
    lastView.current = { azimuth, kmPerPixel }
    callback({ azimuth, kmPerPixel })
  }, [camera, size.height])

  const markerSpot = useMemo(() => {
    const { x, y } = projectLaea(marker.lat, marker.lng)
    const u = (x - region.minX) / region.metresPerPixel
    const v = (region.maxY - y) / region.metresPerPixel
    return {
      x: (u - region.width / 2) * region.metresPerPixel / 1000,
      z: (v - region.height / 2) * region.metresPerPixel / 1000,
      elevation: sampleElevation(heightmap, u - 0.5, v - 0.5),
    }
  }, [marker.lat, marker.lng, region, heightmap])

  const fit = useMemo(
    () => fitCamera(terrain, region, camera.fov, size.width / Math.max(1, size.height)),
    [terrain, region, camera.fov, size.width, size.height]
  )

  const apply = (k: number) => {
    current.current = k
    applyExaggeration(terrain, k)
    if (markerGroup.current) markerGroup.current.position.y = worldHeight(markerSpot.elevation, k)
    invalidate()
  }

  useLayoutEffect(() => {
    if (markerGroup.current) markerGroup.current.position.y = worldHeight(markerSpot.elevation, current.current)
  }, [markerSpot])

  const fitted = useRef(false)
  useLayoutEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    startTarget.current.set(0, fit.centerY, 0)
    startPosition.current.copy(START_DIRECTION).multiplyScalar(fit.distance).add(startTarget.current)
    if (fitted.current) {
      const offset = camera.position.clone().sub(orbit.target)
      orbit.target.copy(startTarget.current)
      camera.position.copy(offset.setLength(fit.distance).add(startTarget.current))
    } else {
      fitted.current = true
      orbit.target.copy(startTarget.current)
      camera.position.copy(startPosition.current)
    }
    orbit.update()
    reportView()
    invalidate()
  }, [fit, camera, reportView])

  useEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    orbit.addEventListener('change', reportView)
    return () => orbit.removeEventListener('change', reportView)
  }, [reportView])

  useEffect(() => {
    const orbit = controls.current
    if (!orbit) return
    const stop = () => {
      resetAnimation.current = null
    }
    orbit.addEventListener('start', stop)
    return () => orbit.removeEventListener('start', stop)
  }, [])

  const lastResetSignal = useRef(resetSignal)
  useEffect(() => {
    if (lastResetSignal.current === resetSignal) return
    lastResetSignal.current = resetSignal
    const orbit = controls.current
    if (!orbit) return
    if (reducedMotion) {
      resetAnimation.current = null
      camera.position.copy(startPosition.current)
      orbit.target.copy(startTarget.current)
      orbit.update()
      invalidate()
      return
    }
    resetAnimation.current = {
      fromPosition: camera.position.clone(),
      fromTarget: orbit.target.clone(),
      start: performance.now(),
    }
    invalidate()
  }, [resetSignal, reducedMotion, camera])

  useEffect(() => {
    if (current.current === exaggeration) return
    if (reducedMotion) {
      animation.current = null
      apply(exaggeration)
      return
    }
    animation.current = { from: current.current, to: exaggeration, start: performance.now() }
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exaggeration, reducedMotion])

  useFrame(() => {
    const reset = resetAnimation.current
    const orbit = controls.current
    if (reset && orbit) {
      const progress = Math.min(1, (performance.now() - reset.start) / RESET_DURATION_MS)
      const eased = easeInOut(progress)
      camera.position.lerpVectors(reset.fromPosition, startPosition.current, eased)
      orbit.target.lerpVectors(reset.fromTarget, startTarget.current, eased)
      orbit.update()
      if (progress >= 1) resetAnimation.current = null
      else invalidate()
    }

    const running = animation.current
    if (!running) return
    const t = Math.min(1, (performance.now() - running.start) / DURATION_MS)
    apply(running.from + (running.to - running.from) * easeInOut(t))
    if (t >= 1) animation.current = null
  })

  const scale = regionScale(region)

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, fit.distance * 2, fit.distance * 4]} />
      <hemisphereLight args={['#dfe6ee', '#2a2622', 0.9]} />
      <directionalLight position={[-350 * scale, 600 * scale, -300 * scale]} intensity={2.4} />

      <mesh geometry={terrain.geometry} frustumCulled={false}>
        <meshStandardMaterial color="#ffffff" vertexColors roughness={1} metalness={0} />
      </mesh>

      <group ref={markerGroup} position-x={markerSpot.x} position-z={markerSpot.z}>
        <group scale={scale}>
          <mesh position={[0, 4, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.2, 8, 20]} />
            <meshStandardMaterial color="#1f2326" roughness={0.6} />
          </mesh>
          <Html position={[0, 10, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-0.5 text-xs text-white select-none">
              {marker.label}
              <span aria-hidden className="h-2 w-2 rounded-full bg-teal" />
            </span>
          </Html>
        </group>
      </group>

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        minDistance={fit.distance * 0.25}
        maxDistance={fit.distance * 1.5}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}
