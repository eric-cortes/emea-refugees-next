'use client'

import { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTranslations } from 'next-intl'
import { RxReset } from 'react-icons/rx'
import { getCity } from '@/constants/cities'
import { getRegion } from '@/constants/regions'
import { cn } from '@/utils/cn'
import { buildTerrainGeometry, type TerrainGeometryData } from './build-terrain-geometry'
import { loadHeightmap, type HeightmapData } from './load-heightmap'
import { regionScale } from './region-scale'
import TerrainScene from './terrain-scene'
import TerrainStatus, { type TerrainStatusState } from './terrain-status'

interface Props {
  regionId: string
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

export default function TerrainView({ regionId }: Props) {
  const t = useTranslations('mapTest')
  const tc = useTranslations('cities.names')
  const tn = useTranslations('mapTest.countries')
  const region = getRegion(regionId)
  const city = region ? getCity(region.marker) : undefined

  const [state, setState] = useState<TerrainStatusState | 'ready'>('loading')
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [exaggerated, setExaggerated] = useState(true)
  const [resetSignal, setResetSignal] = useState(0)

  useEffect(() => {
    if (!region) return
    let cancelled = false

    const run = async () => {
      if (!supportsWebGL()) {
        setState('unsupported')
        return
      }
      try {
        const heightmap = await loadHeightmap(region)
        if (cancelled) return
        const terrain = buildTerrainGeometry(heightmap, region, region.exaggeration)
        setLoaded({ heightmap, terrain })
        setExaggerated(true)
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
    setAttempt(value => value + 1)
  }, [])

  if (!region || !city || city.lat === undefined || city.lng === undefined) {
    return (
      <div className="md:grid md:grid-cols-2 md:items-start">
        <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
          <TerrainStatus state="error" />
        </section>
        <div className="md:min-h-dvh md:bg-panel" />
      </div>
    )
  }

  const country = tn(region.id)
  const scale = regionScale(region)
  const ready = state === 'ready' && loaded !== null

  return (
    <div className="animate-fade-in md:grid md:grid-cols-2 md:items-start">
      <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
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
              exaggeration={exaggerated ? region.exaggeration : 1}
              resetSignal={resetSignal}
              marker={{ lat: city.lat, lng: city.lng, label: tc(city.slug) }}
            />
          </Canvas>
        ) : (
          <TerrainStatus state={state === 'ready' ? 'loading' : state} onRetry={retry} />
        )}
  
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-4 p-4 text-white/80">
          <div className="max-w-md">
            <h1 className="text-2xl text-white">{t('title', { country })}</h1>
            <p className="mt-1 text-sm">{t('hint')}</p>
            <p className="mt-3 text-xs text-white/50">{t('credit')}</p>
          </div>
          {ready && (
            <div className="pointer-events-auto flex flex-col items-end gap-2">
              <p aria-live="polite" className="h-4 whitespace-nowrap text-xs leading-4 text-white/60">
                {exaggerated ? t('height.noteExaggerated', { factor: region.exaggeration }) : t('height.noteReal')}
              </p>
              <div className="flex items-center gap-3">
                <div role="group" aria-label={t('height.label')} className="flex rounded-full bg-black/70 p-1 text-sm">
                  {[true, false].map(value => (
                    <button
                      key={String(value)}
                      type="button"
                      aria-pressed={exaggerated === value}
                      onClick={() => setExaggerated(value)}
                      className={cn(
                        'w-28 cursor-pointer rounded-full px-3 py-1.5 text-center',
                        exaggerated === value ? 'bg-teal text-black' : 'text-white hover:bg-white/10'
                      )}
                    >
                      {value ? t('height.exaggerated', { factor: region.exaggeration }) : t('height.real')}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setResetSignal(value => value + 1)}
                  aria-label={t('reset')}
                  title={t('reset')}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <RxReset aria-hidden />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <div className="md:min-h-dvh md:bg-panel" />
    </div>
  )
}
