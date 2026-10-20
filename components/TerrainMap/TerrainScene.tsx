'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type ComponentRef, type RefObject } from 'react'
import { invalidate, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MathUtils, Spherical, Vector3, type BufferAttribute, type Group, type Object3D, type PerspectiveCamera } from 'three'
import type { Region, RegionPoi } from '@/constants/regions'
import { projectLaea } from '@/utils/laea'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'
import { applyExaggeration, worldHeight, type TerrainGeometryData } from './build-terrain-geometry'
import { regionScale } from './region-scale'
import { sampleElevation, type HeightmapData } from './load-heightmap'
import { computeSeasonColours, type Season } from './season-temperatures'

const DURATION_MS = 600
const SEASON_FADE_MS = 700
const RESET_DURATION_MS = 700
const INTRO_DURATION_MS = 800
const INTRO_DISTANCE = 1.15
const INTRO_POLAR = MathUtils.degToRad(35)
const BACKGROUND = '#2f3336'
const FIT_MARGIN = 1.06
const START_DIRECTION = new Vector3(0, 3, 1).normalize()

interface MarkerSpec {
  lat: number
  lng: number
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
  labelRef: RefObject<HTMLSpanElement | null>
  pois?: RegionPoi[]
  poiRefs?: RefObject<(HTMLButtonElement | null)[]>
  zoom?: boolean
  season?: Season | null
  onViewChange?: (view: ViewState) => void
  onRotateChange?: (rotating: boolean) => void
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

export default function TerrainScene({ terrain, heightmap, region, exaggeration, resetSignal, marker, labelRef, pois = [], poiRefs, zoom = true, season = null, onViewChange, onRotateChange }: Props) {
  const reducedMotion = usePrefersReducedMotion()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const markerGroup = useRef<Group>(null)
  const labelAnchor = useRef<Object3D>(null)
  const poiGroups = useRef<(Group | null)[]>([])
  const poiAnchors = useRef<(Object3D | null)[]>([])
  const labelPoint = useMemo(() => new Vector3(), [])
  const current = useRef(exaggeration)
  const animation = useRef<Animation | null>(null)
  const camera = useThree(state => state.camera) as PerspectiveCamera
  const size = useThree(state => state.size)
  const startPosition = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const resetAnimation = useRef<ResetAnimation | null>(null)
  const introAnimation = useRef<{ from: Spherical; start: number } | null>(null)
  const introTo = useMemo(() => new Spherical(), [])
  const introResult = useMemo(() => new Spherical(), [])
  const introOffset = useMemo(() => new Vector3(), [])

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

  const poiSpots = useMemo(
    () =>
      pois.map(poi => {
        const { x, y } = projectLaea(poi.lat, poi.lng)
        const u = (x - region.minX) / region.metresPerPixel
        const v = (region.maxY - y) / region.metresPerPixel
        return {
          x: (u - region.width / 2) * region.metresPerPixel / 1000,
          z: (v - region.height / 2) * region.metresPerPixel / 1000,
          elevation: sampleElevation(heightmap, u - 0.5, v - 0.5),
        }
      }),
    [pois, region, heightmap]
  )

  const fit = useMemo(
    () => fitCamera(terrain, region, camera.fov, size.width / Math.max(1, size.height)),
    [terrain, region, camera.fov, size.width, size.height]
  )

  const apply = (k: number) => {
    current.current = k
    applyExaggeration(terrain, k)
    if (markerGroup.current) markerGroup.current.position.y = worldHeight(markerSpot.elevation, k)
    poiSpots.forEach((spot, index) => {
      const group = poiGroups.current[index]
      if (group) group.position.y = worldHeight(spot.elevation, k)
    })
    invalidate()
  }

  useLayoutEffect(() => {
    if (markerGroup.current) markerGroup.current.position.y = worldHeight(markerSpot.elevation, current.current)
  }, [markerSpot])

  useLayoutEffect(() => {
    poiSpots.forEach((spot, index) => {
      const group = poiGroups.current[index]
      if (group) group.position.y = worldHeight(spot.elevation, current.current)
    })
  }, [poiSpots])

  const seasonFade = useRef<{ from: Float32Array; to: Float32Array; start: number | null }>({
    from: new Float32Array(0),
    to: new Float32Array(0),
    start: null,
  })
  useLayoutEffect(() => {
    const size = terrain.surfaceCount * 3
    seasonFade.current = { from: new Float32Array(size), to: new Float32Array(size), start: null }
  }, [terrain])

  const firstColours = useRef(true)
  useLayoutEffect(() => {
    // The geometry is built with elevation colours, so the first pass has nothing to do
    if (firstColours.current) {
      firstColours.current = false
      if (!season) return
    }
    const attribute = terrain.geometry.getAttribute('color') as BufferAttribute
    const array = attribute.array as Float32Array
    const { from, to } = seasonFade.current
    computeSeasonColours(terrain, region.id, season, to)
    if (reducedMotion) {
      seasonFade.current.start = null
      array.set(to)
      attribute.needsUpdate = true
    } else {
      // Start from the colours currently shown, so a change mid-fade does not jump
      from.set(array.subarray(0, from.length))
      seasonFade.current.start = performance.now()
    }
    invalidate()
  }, [terrain, region.id, season, reducedMotion])

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
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const from = new Spherical().setFromVector3(startPosition.current.clone().sub(startTarget.current))
        from.radius = fit.distance * INTRO_DISTANCE
        from.phi = INTRO_POLAR
        camera.position.setFromSpherical(from).add(startTarget.current)
        introAnimation.current = { from, start: performance.now() }
      } else {
        camera.position.copy(startPosition.current)
      }
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
      introAnimation.current = null
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
    introAnimation.current = null
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
    const intro = introAnimation.current
    if (intro && orbit) {
      const progress = Math.min(1, (performance.now() - intro.start) / INTRO_DURATION_MS)
      const eased = easeInOut(progress)
      introTo.setFromVector3(introOffset.copy(startPosition.current).sub(startTarget.current))
      introResult.set(
        intro.from.radius + (introTo.radius - intro.from.radius) * eased,
        intro.from.phi + (introTo.phi - intro.from.phi) * eased,
        introTo.theta
      )
      camera.position.setFromSpherical(introResult).add(startTarget.current)
      orbit.target.copy(startTarget.current)
      orbit.update()
      if (progress >= 1) introAnimation.current = null
      else invalidate()
    }

    if (reset && orbit) {
      const progress = Math.min(1, (performance.now() - reset.start) / RESET_DURATION_MS)
      const eased = easeInOut(progress)
      camera.position.lerpVectors(reset.fromPosition, startPosition.current, eased)
      orbit.target.lerpVectors(reset.fromTarget, startTarget.current, eased)
      orbit.update()
      if (progress >= 1) resetAnimation.current = null
      else invalidate()
    }

    const fade = seasonFade.current
    if (fade.start !== null) {
      const progress = Math.min(1, (performance.now() - fade.start) / SEASON_FADE_MS)
      const eased = easeInOut(progress)
      const attribute = terrain.geometry.getAttribute('color') as BufferAttribute
      const array = attribute.array as Float32Array
      for (let i = 0; i < fade.to.length; i++) array[i] = fade.from[i] + (fade.to[i] - fade.from[i]) * eased
      attribute.needsUpdate = true
      if (progress >= 1) fade.start = null
      else invalidate()
    }

    const running = animation.current
    if (!running) return
    const t = Math.min(1, (performance.now() - running.start) / DURATION_MS)
    apply(running.from + (running.to - running.from) * easeInOut(t))
    if (t >= 1) animation.current = null
  })

  useFrame(() => {
    const anchor = labelAnchor.current
    const label = labelRef.current
    if (!anchor || !label) return
    camera.updateMatrixWorld()
    anchor.getWorldPosition(labelPoint).project(camera)
    const x = ((labelPoint.x + 1) / 2) * size.width
    const y = ((1 - labelPoint.y) / 2) * size.height
    label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    label.style.visibility = labelPoint.z < 1 ? 'visible' : 'hidden'
  })

  useFrame(() => {
    poiSpots.forEach((_, index) => {
      const anchor = poiAnchors.current[index]
      const button = poiRefs?.current[index]
      if (!anchor || !button) return
      camera.updateMatrixWorld()
      anchor.getWorldPosition(labelPoint).project(camera)
      const x = ((labelPoint.x + 1) / 2) * size.width
      const y = ((1 - labelPoint.y) / 2) * size.height
      button.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      button.style.visibility = labelPoint.z < 1 ? 'visible' : 'hidden'
    })
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
          <object3D ref={labelAnchor} position={[0, 10, 0]} />
        </group>
      </group>

      {pois.map((poi, index) => (
        <group
          key={poi.id}
          ref={node => {
            poiGroups.current[index] = node
          }}
          position-x={poiSpots[index].x}
          position-z={poiSpots[index].z}
        >
          <group scale={scale}>
            <mesh position={[0, 4, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[2.2, 8, 20]} />
              <meshStandardMaterial color="#fe6a6a" roughness={0.6} />
            </mesh>
            <object3D
              ref={node => {
                poiAnchors.current[index] = node
              }}
              position={[0, 10, 0]}
            />
          </group>
        </group>
      ))}

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableZoom={zoom}
        minDistance={fit.distance * 0.25}
        maxDistance={fit.distance * 1.5}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2}
        onStart={() => onRotateChange?.(true)}
        onEnd={() => onRotateChange?.(false)}
      />
    </>
  )
}
