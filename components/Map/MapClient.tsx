'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type AnimationEvent, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { RxReset } from 'react-icons/rx'
import { CITIES, getCity, type City } from '@/constants/cities'
import { DEFAULT_PERIOD, PERIODS, WAYPOINTS, getPeriod, getPeriodSlugs, getRoutePoints, isPeriodId, type PeriodId } from '@/constants/routes'
import { EUROPE_PATHS } from '@/constants/europe-paths'
import TransitionLink from '@/components/Layout/TransitionLink'
import TerrainLegendBox from '@/components/TerrainMap/TerrainLegendBox'
import { IconButton, MapDot, Pill, PILL_CLASS, PILL_INTERACTIVE_CLASS, SegmentedSwitch, Tooltip } from '@/components/UI'
import { cn } from '@/utils/cn'
import { storePeriod } from '@/utils/map-period-storage'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'
import CityDrawer from './CityDrawer'
import EuropeMap from './EuropeMap'
import MapLegend from './MapLegend'
import { useMapAspect } from './use-map-aspect'
import { useMapView, viewBoxFor, type MapView } from './use-map-view'

const DRAWER_CITIES = CITIES.filter(city => city.type === 'stop').map(city => city.slug)

const DOT_SCALE_CLASS = 'origin-center [transform-box:fill-box] [transform:scale(calc(var(--dot-r)/var(--dot-base)),calc(var(--dot-r)/var(--dot-base)/1.07))]'
const CITY_DOT_CLASS = '[--dot-base:3.28] [&_circle]:origin-center [&_circle]:[transform-box:fill-box] [&_circle]:[transform:scale(calc(var(--dot-r)/var(--dot-base)),calc(var(--dot-r)/var(--dot-base)/1.07))]'

function Dot({ city, muted }: { city: City; muted: boolean }) {
  return (
    <g className={cn(CITY_DOT_CLASS, 'transition-opacity duration-300 motion-reduce:transition-none', muted && 'opacity-40')}>
      <MapDot cx={city.cx} cy={city.cy} tone={city.type === 'stop' ? 'red' : 'teal'} variant="pulse" />
    </g>
  )
}

const PILL_POSITION_CLASS = 'absolute -translate-x-[calc(100%-0.875rem)] -translate-y-1/2'

const DASH_LENGTH = 2300
const FADE_MS = 700
const LABEL_DELAY_MS = 2000
const MAP_CENTER = { x: 460, y: 255 }
const MAP_ZOOM = 1.17
const BASE_WIDTH = 1000
const BASE_HEIGHT = 684
const START_VIEW: MapView = { x: MAP_CENTER.x, y: MAP_CENTER.y, zoom: MAP_ZOOM }
const VIEWBOX = viewBoxFor(START_VIEW, BASE_WIDTH, BASE_HEIGHT)
const MUTED_PILL_CLASS = 'opacity-40 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none'

type PillPositions = Record<string, { x: number; y: number }>

export default function MapClient() {
  const t = useTranslations('map')
  const tc = useTranslations('cities.names')
  const measureRef = useRef<(() => void) | null>(null)
  const params = useSearchParams()
  const paneParam = params.get('pane')
  const periodParam = params.get('period')
  const [period, setPeriod] = useState<PeriodId>(isPeriodId(periodParam) ? periodParam : DEFAULT_PERIOD)
  const [switched, setSwitched] = useState(false)
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

  const reducedMotion = usePrefersReducedMotion()
  const { moved, dragging, resetView } = useMapView({
    container,
    start: START_VIEW,
    baseWidth: BASE_WIDTH,
    baseHeight: BASE_HEIGHT,
    aspect,
    reducedMotion,
    onFrame: () => measureRef.current?.(),
  })
  const activePeriod = getPeriod(period)
  const periodSlugs = getPeriodSlugs(activePeriod)

  useEffect(() => {
    storePeriod(period)
  }, [period])

  const selectPeriod = (next: PeriodId) => {
    if (next === period) return
    const query = new URLSearchParams(window.location.search)
    query.set('period', next)
    window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`)
    setSwitched(true)
    setPeriod(next)
  }

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
    measureRef.current = measure
    window.addEventListener('resize', measure)
    return () => {
      measureRef.current = null
      window.removeEventListener('resize', measure)
    }
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
  }, [reducedMotion, period])

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
      <div
        ref={container}
        className={cn(
          "relative h-dvh w-full overflow-hidden animate-fade-in bg-[url('/assets/images/map/texture.jpg')] bg-fixed bg-cover bg-center bg-no-repeat",
          dragging ? 'cursor-grabbing select-none **:cursor-grabbing' : 'cursor-grab'
        )}
      >
        <EuropeMap className="block h-full w-full origin-center scale-y-107 overflow-visible" preserveAspectRatio={aspect} viewBox={VIEWBOX}>
          <clipPath id="hillshade-clip">
            {EUROPE_PATHS.map((p, i) => (
              <path key={p.id ?? i} d={p.d} />
            ))}
          </clipPath>
          <image href={'/assets/images/map/hillshade.webp'} x={-55} y={-135} width={730} height={580} preserveAspectRatio="none" clipPath="url(#hillshade-clip)" className="pointer-events-none mix-blend-soft-light" aria-hidden="true" />
          <g key={period}>
            {activePeriod.branches.map((branch, index) => (
              <polyline
                key={index}
                className={cn(
                  'fill-none stroke-teal opacity-50 [stroke-width:0.35] motion-reduce:animate-none',
                  switched ? 'animate-[fade-in_1.2s_ease_0.4s_both]' : 'animate-[fade-in_1.2s_ease_1.5s_both]'
                )}
                points={getRoutePoints(branch)}
              />
            ))}
            {activePeriod.dashed && (
              <polyline
                className={cn(
                  'fill-none stroke-teal opacity-80 [stroke-dasharray:2_1.5] [stroke-width:0.7] motion-reduce:animate-none',
                  switched ? 'animate-[fade-in_1.2s_ease_1s_both]' : 'animate-[fade-in_1.2s_ease_2.5s_both]'
                )}
                points={getRoutePoints(activePeriod.dashed)}
              />
            )}
            <polyline
              ref={route}
              className={cn(
                'fill-none stroke-teal opacity-80 [stroke-dasharray:2300] [stroke-dashoffset:2300] [stroke-width:0.7] motion-reduce:[stroke-dashoffset:0]',
                switched ? 'animate-[draw_6s_forwards]' : 'animate-draw'
              )}
              points={getRoutePoints(activePeriod.main)}
              onAnimationEnd={onDrawEnd}
            />
          </g>
          {[...CITIES, ...WAYPOINTS].map(point => (
            <circle key={point.slug} data-anchor={point.slug} className="pointer-events-none fill-transparent" cx={point.cx} cy={point.cy} r={0.01} />
          ))}
          {showDots && (
            <g className={cn('transition-opacity duration-700 motion-reduce:duration-0', swapped && 'opacity-0')} aria-hidden={swapped || undefined}>
          {CITIES.map(city => {
            if (swapped) {
              return (
                <g key={city.slug} className="pointer-events-none" aria-hidden>
                  <Dot city={city} muted={!periodSlugs.has(city.slug)} />
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
                  <Dot city={city} muted={!periodSlugs.has(city.slug)} />
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
                  <Dot city={city} muted={!periodSlugs.has(city.slug)} />
                </g>
              )
            }
            return (
              <g key={city.slug} className="pointer-events-none" aria-hidden>
                <Dot city={city} muted={!periodSlugs.has(city.slug)} />
              </g>
            )
          })}
              {WAYPOINTS.filter(waypoint => periodSlugs.has(waypoint.slug)).map(waypoint => (
                <circle
                  key={`${period}-${waypoint.slug}`}
                  className={cn(DOT_SCALE_CLASS, '[--dot-base:1.6] pointer-events-none animate-[fade-in_0.7s_ease_both] fill-red motion-reduce:animate-none')}
                  cx={waypoint.cx}
                  cy={waypoint.cy}
                  r={1.6}
                  aria-hidden
                />
              ))}
            </g>
          )}
        </EuropeMap>
        {showPills && (
          <div data-map-layer className="pointer-events-none absolute inset-0 animate-[fade-in_0.7s_ease_both] motion-reduce:animate-none">
            {WAYPOINTS.filter(waypoint => periodSlugs.has(waypoint.slug)).map(waypoint => {
              const point = positions[waypoint.slug]
              if (!point) return null
              return (
                <span
                  key={`${period}-${waypoint.slug}`}
                  aria-hidden
                  className={cn(PILL_CLASS, PILL_POSITION_CLASS, 'animate-[fade-in_0.7s_ease_both] motion-reduce:animate-none')}
                  style={{ left: point.x, top: point.y }}
                >
                  {tc(waypoint.slug)}
                  <span aria-hidden className="h-2 w-2 rounded-full bg-red" />
                </span>
              )
            })}
            {CITIES.map(city => {
              const point = positions[city.slug]
              if (!point) return null
              const style = { left: point.x, top: point.y }
              const muted = !periodSlugs.has(city.slug)
              const content = <Pill name={tc(city.slug)} tone={city.type === 'stop' ? 'red' : 'teal'} />
              if (city.hasPage) {
                return (
                  <TransitionLink
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    aria-label={t('dot.goToCity', { city: tc(city.slug) })}
                    className={cn(PILL_CLASS, PILL_INTERACTIVE_CLASS, PILL_POSITION_CLASS, muted && MUTED_PILL_CLASS)}
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
                    className={cn(PILL_CLASS, PILL_INTERACTIVE_CLASS, PILL_POSITION_CLASS, muted && MUTED_PILL_CLASS)}
                    style={style}
                    onClick={() => setOpenPane(city.slug)}
                  >
                    {content}
                  </button>
                )
              }
              return (
                <span key={city.slug} aria-hidden className={cn(PILL_CLASS, PILL_POSITION_CLASS, muted && MUTED_PILL_CLASS)} style={style}>
                  {content}
                </span>
              )
            })}
          </div>
        )}
        <div className="pointer-events-none absolute left-0 top-0 z-20 flex flex-col items-start gap-2 p-4 md:pl-16">
          <SegmentedSwitch
            label={t('period.label')}
            value={period}
            onChange={selectPeriod}
            options={PERIODS.map(item => ({
              value: item.id,
              label: (
                <>
                  <span className="hidden min-[1100px]:inline">{t(`period.${item.id}.label`)}</span>
                  <span className="min-[1100px]:hidden">{t(`period.${item.id}.short`)}</span>
                </>
              ),
            }))}
          />
          <div className="pointer-events-auto cursor-default">
            <TerrainLegendBox>
              <div aria-live="polite" className="w-[calc(100vw-3.5rem)] max-w-96">
                <p className="leading-snug">{t(`period.${period}.text`)}</p>
                <p className="mt-2 text-white/50">
                  {t('drawer.source')} {t(`period.${period}.source`)}
                </p>
              </div>
            </TerrainLegendBox>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 flex flex-col items-start gap-2 p-4 md:pl-16">
          <div className="hidden items-center gap-2 pointer-fine:flex">
            <span className="rounded-full bg-black/70 px-3 py-1 text-[10px] text-white">{t('zoomHint')}</span>
            <IconButton
              variant="solid"
              size="lg"
              onClick={resetView}
              aria-label={t('resetView')}
              tabIndex={moved ? 0 : -1}
              className={cn(
                'group relative transition-[opacity,visibility] duration-300 motion-reduce:transition-none',
                moved ? 'pointer-events-auto opacity-100' : 'pointer-events-none invisible opacity-0'
              )}
            >
              <RxReset aria-hidden />
              <Tooltip label={t('resetView')} side="right" />
            </IconButton>
          </div>
          <div className="pointer-events-auto cursor-default">
            <TerrainLegendBox>
              <MapLegend period={activePeriod} />
            </TerrainLegendBox>
          </div>
        </div>
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
