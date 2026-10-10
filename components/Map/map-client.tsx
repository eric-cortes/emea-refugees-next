'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type AnimationEvent, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CITIES, getCity, getRoutePoints, type City } from '@/constants/cities'
import { EUROPE_PATHS } from '@/constants/europe-paths'
import TransitionLink from '@/components/Layout/transition-link'
import { MapDot, Pill, PILL_CLASS, PILL_INTERACTIVE_CLASS } from '@/components/UI'
import { asset } from '@/utils/asset'
import { cn } from '@/utils/cn'
import CityDrawer from './city-drawer'
import EuropeMap from './europe-map'
import { useMapAspect } from './use-map-aspect'

const DRAWER_CITIES = CITIES.filter(city => city.type === 'stop').map(city => city.slug)

function Dot({ city }: { city: City }) {
  return <MapDot cx={city.cx} cy={city.cy} tone={city.type === 'stop' ? 'red' : 'teal'} variant="pulse" />
}

const PILL_POSITION_CLASS = 'absolute -translate-x-1/2 -translate-y-1/2'

const DASH_LENGTH = 2300
const FADE_MS = 700
const LABEL_DELAY_MS = 2000

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

type PillPositions = Record<string, { x: number; y: number }>

export default function MapClient() {
  const t = useTranslations('map')
  const tc = useTranslations('cities.names')
  const params = useSearchParams()
  const paneParam = params.get('pane')
  const [openPane, setOpenPane] = useState<string | null>(
    paneParam && DRAWER_CITIES.includes(paneParam) ? paneParam : null
  )
  const aspect = useMapAspect()
  const triggers = useRef<Record<string, SVGGElement | HTMLButtonElement | null>>({})
  const container = useRef<HTMLDivElement>(null)
  const route = useRef<SVGPolylineElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [delayed, setDelayed] = useState(false)
  const [dotsGone, setDotsGone] = useState(false)
  const [positions, setPositions] = useState<PillPositions | null>(null)

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  useLayoutEffect(() => {
    if (!drawn && !reducedMotion) return
    const measure = () => {
      const root = container.current
      if (!root) return
      const origin = root.getBoundingClientRect()
      const next: PillPositions = {}
      root.querySelectorAll<SVGCircleElement>('[data-anchor]').forEach(anchor => {
        const rect = anchor.getBoundingClientRect()
        next[anchor.dataset.anchor ?? ''] = { x: rect.left + rect.width / 2 - origin.left, y: rect.top + rect.height / 2 - origin.top }
      })
      setPositions(next)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [drawn, reducedMotion, aspect])

  useEffect(() => {
    const line = route.current
    if (!line || reducedMotion) return
    const threshold = DASH_LENGTH - line.getTotalLength()
    let frame = 0
    const check = () => {
      if (parseFloat(getComputedStyle(line).strokeDashoffset) <= threshold) {
        setDrawn(true)
        return
      }
      frame = requestAnimationFrame(check)
    }
    frame = requestAnimationFrame(check)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  useEffect(() => {
    if (!drawn) return
    const timer = setTimeout(() => setDelayed(true), LABEL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [drawn])

  const swapped = delayed || reducedMotion

  useEffect(() => {
    if (!delayed) return
    const timer = setTimeout(() => setDotsGone(true), FADE_MS)
    return () => clearTimeout(timer)
  }, [delayed])

  const onDrawEnd = (event: AnimationEvent<SVGPolylineElement>) => {
    if (event.animationName === 'draw') setDrawn(true)
  }

  const closePane = useCallback(() => {
    if (openPane) {
      const trigger = triggers.current[openPane]
      requestAnimationFrame(() => trigger?.focus())
    }
    setOpenPane(null)
  }, [openPane])

  const onDotKey = (event: KeyboardEvent<SVGGElement>, slug: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenPane(slug)
    }
  }

  const showPills = swapped && positions !== null
  const showDots = !reducedMotion && !dotsGone
  const active = openPane ? getCity(openPane) : undefined

  return (
    <>
      <div ref={container} className="relative h-dvh w-full overflow-hidden animate-fade-in bg-[url('/emea/assets/images/map/texture.jpg')] bg-fixed bg-cover bg-center bg-no-repeat">
        <EuropeMap className="block h-full w-full origin-center translate-y-16 scale-y-107 overflow-visible" preserveAspectRatio={aspect}>
          <clipPath id="hillshade-clip">
            {EUROPE_PATHS.map((p, i) => (
              <path key={p.id ?? i} d={p.d} />
            ))}
          </clipPath>
          <image href={asset('/assets/images/map/hillshade.webp')} x={-55} y={-135} width={730} height={580} preserveAspectRatio="none" clipPath="url(#hillshade-clip)" className="pointer-events-none mix-blend-soft-light" aria-hidden="true" />
          <polyline ref={route} className="animate-draw fill-none stroke-teal opacity-80 [stroke-dasharray:2300] [stroke-dashoffset:2300] [stroke-width:0.7] motion-reduce:[stroke-dashoffset:0]" points={getRoutePoints()} onAnimationEnd={onDrawEnd} />
          {CITIES.map(city => (
            <circle key={city.slug} data-anchor={city.slug} className="pointer-events-none fill-transparent" cx={city.cx} cy={city.cy} r={0.01} />
          ))}
          {showDots && (
            <g className={cn('transition-opacity duration-700 motion-reduce:duration-0', swapped && 'opacity-0')} aria-hidden={swapped || undefined}>
          {CITIES.map(city => {
            if (swapped) {
              return (
                <g key={city.slug} className="pointer-events-none" aria-hidden>
                  <Dot city={city} />
                </g>
              )
            }
            if (city.hasPage) {
              return (
                <TransitionLink
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                  aria-label={t('dot.goToCity', { city: tc(city.slug) })}
                  className="cursor-pointer"
                >
                  <Dot city={city} />
                </TransitionLink>
              )
            }
            if (DRAWER_CITIES.includes(city.slug)) {
              return (
                <g
                  key={city.slug}
                  ref={node => {
                    triggers.current[city.slug] = node
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={t('dot.openCity', { city: tc(city.slug) })}
                  aria-haspopup="dialog"
                  className="cursor-pointer"
                  onClick={() => setOpenPane(city.slug)}
                  onKeyDown={event => onDotKey(event, city.slug)}
                >
                  <Dot city={city} />
                </g>
              )
            }
            return (
              <g key={city.slug} className="pointer-events-none" aria-hidden>
                <Dot city={city} />
              </g>
            )
          })}
            </g>
          )}
        </EuropeMap>
        {showPills && (
          <div className="pointer-events-none absolute inset-0 animate-[fade-in_0.7s_ease_both] motion-reduce:animate-none">
            {CITIES.map(city => {
              const point = positions[city.slug]
              if (!point) return null
              const style = { left: point.x, top: point.y }
              const content = <Pill name={tc(city.slug)} tone={city.type === 'stop' ? 'red' : 'teal'} />
              if (city.hasPage) {
                return (
                  <TransitionLink
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    aria-label={t('dot.goToCity', { city: tc(city.slug) })}
                    className={cn(PILL_CLASS, PILL_INTERACTIVE_CLASS, PILL_POSITION_CLASS)}
                    style={style}
                  >
                    {content}
                  </TransitionLink>
                )
              }
              if (DRAWER_CITIES.includes(city.slug)) {
                return (
                  <button
                    key={city.slug}
                    type="button"
                    ref={node => {
                      triggers.current[city.slug] = node
                    }}
                    aria-label={t('dot.openCity', { city: tc(city.slug) })}
                    aria-haspopup="dialog"
                    className={cn(PILL_CLASS, PILL_INTERACTIVE_CLASS, PILL_POSITION_CLASS)}
                    style={style}
                    onClick={() => setOpenPane(city.slug)}
                  >
                    {content}
                  </button>
                )
              }
              return (
                <span key={city.slug} aria-hidden className={cn(PILL_CLASS, PILL_POSITION_CLASS)} style={style}>
                  {content}
                </span>
              )
            })}
          </div>
        )}
      </div>
      <CityDrawer
        citySlug={openPane}
        title={active ? tc(active.slug) : ''}
        videoSrc={active?.video}
        onClose={closePane}
      />
    </>
  )
}
