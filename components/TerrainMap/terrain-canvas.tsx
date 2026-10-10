'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTranslations } from 'next-intl'
import { RxReset } from 'react-icons/rx'
import { getCity } from '@/constants/cities'
import { IconButton, Pill, PILL_CLASS, PILL_INTERACTIVE_CLASS } from '@/components/UI'
import { getRegion } from '@/constants/regions'
import { buildTerrainGeometry, type TerrainGeometryData } from './build-terrain-geometry'
import { cn } from '@/utils/cn'
import { loadHeightmap, type HeightmapData } from './load-heightmap'
import { regionScale } from './region-scale'
import TerrainCompass from './terrain-compass'
import TerrainLegend from './terrain-legend'
import TerrainScaleBar from './terrain-scale-bar'
import TerrainScene, { type ViewState } from './terrain-scene'
import TerrainStatus, { type TerrainStatusState } from './terrain-status'

interface Props {
  regionId: string
  zoom?: boolean
  onPoiSelect?: (id: string) => void
}

interface Loaded {
  heightmap: HeightmapData
  terrain: TerrainGeometryData
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

export default function TerrainCanvas({ regionId, zoom = true, onPoiSelect }: Props) {
  const t = useTranslations('mapTest')
  const tc = useTranslations('cities.names')
  const tn = useTranslations('mapTest.countries')
  const tm = useTranslations('map')
  const region = getRegion(regionId)
  const city = region ? getCity(region.marker) : undefined

  const [state, setState] = useState<TerrainStatusState | 'ready'>('loading')
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [progress, setProgress] = useState(10)
  const [attempt, setAttempt] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)
  const [view, setView] = useState<ViewState>({ azimuth: 0, kmPerPixel: 0 })
  const labelRef = useRef<HTMLSpanElement>(null)
  const poiRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!region) return
    let cancelled = false

    const run = async () => {
      if (!supportsWebGL()) {
        setState('unsupported')
        return
      }
      try {
        setProgress(10)
        const heightmap = await loadHeightmap(region, fraction => {
          if (!cancelled) setProgress(Math.round(10 + fraction * 60))
        })
        if (cancelled) return
        setProgress(85)
        await new Promise(requestAnimationFrame)
        if (cancelled) return
        const terrain = buildTerrainGeometry(heightmap, region, region.exaggeration)
        setProgress(100)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          await new Promise(resolve => setTimeout(resolve, 500))
          if (cancelled) return
        }
        setLoaded({ heightmap, terrain })
        setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    }
    void run()

    return () => {
      cancelled = true
    }
  }, [region, attempt])

  useEffect(() => {
    const geometry = loaded?.terrain.geometry
    return () => geometry?.dispose()
  }, [loaded])

  const retry = useCallback(() => {
    setLoaded(null)
    setState('loading')
    setProgress(10)
    setAttempt(value => value + 1)
  }, [])

  if (!region || !city || city.lat === undefined || city.lng === undefined) {
    return <TerrainStatus state="error" />
  }

  const country = tn(region.id)
  const scale = regionScale(region)
  const pois = region.pois ?? []
  const ready = state === 'ready' && loaded !== null

  return (
    <>
      {ready ? (
        <Canvas
          key={attempt}
          role="img"
          aria-label={t('canvasLabel', { country })}
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 1000, 1000], fov: 35, near: 10 * scale, far: 8000 * scale }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', event => {
              event.preventDefault()
              setState('lost')
            })
          }}
        >
          <TerrainScene
            terrain={loaded.terrain}
            heightmap={loaded.heightmap}
            region={region}
            exaggeration={region.exaggeration}
            resetSignal={resetSignal}
            zoom={zoom}
            onViewChange={setView}
            labelRef={labelRef}
            pois={pois}
            poiRefs={poiRefs}
            marker={{ lat: city.lat, lng: city.lng }}
          />
        </Canvas>
      ) : (
        <TerrainStatus state={state === 'ready' ? 'loading' : state} progress={progress} onRetry={retry} />
      )}

      {ready && (
        <>
          <span ref={labelRef} className={cn(PILL_CLASS, 'pointer-events-none invisible absolute left-0 top-0 z-10')}>
            <Pill name={tc(city.slug)} tone="teal" />
          </span>
          {pois.map((poi, index) => (
            <button
              key={poi.id}
              type="button"
              ref={node => {
                poiRefs.current[index] = node
              }}
              aria-label={tm('dot.openCity', { city: tc(poi.id) })}
              onClick={() => onPoiSelect?.(poi.id)}
              className={cn(PILL_CLASS, PILL_INTERACTIVE_CLASS, 'invisible absolute left-0 top-0 z-10')}
            >
              <Pill name={tc(poi.id)} tone="red" />
            </button>
          ))}
          <div className="pointer-events-none absolute left-0 top-0 z-20 p-4">
            <TerrainLegend />
          </div>
          <div className="pointer-events-none absolute right-0 top-0 z-20 flex items-center gap-2 p-4">
            <TerrainScaleBar kmPerPixel={view.kmPerPixel} />
            <TerrainCompass azimuth={view.azimuth} />
            <IconButton
              variant="solid"
              size="lg"
              onClick={() => setResetSignal(value => value + 1)}
              aria-label={t('reset')}
              title={t('reset')}
              className="pointer-events-auto"
            >
              <RxReset aria-hidden />
            </IconButton>
          </div>
        </>
      )}
    </>
  )
}
