'use client'

import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CITIES, getCity, getRoutePoints, type City } from '@/constants/cities'
import TransitionLink from '@/components/Layout/transition-link'
import { cn } from '@/utils/cn'
import CityDrawer from './city-drawer'
import EuropeMap from './europe-map'
import { useMapAspect } from './use-map-aspect'

const DRAWER_CITIES = ['lampedusa']

function Dot({ city }: { city: City }) {
  const stop = city.type === 'stop'
  return (
    <>
      <circle className={cn('opacity-40', stop ? 'fill-red stroke-red' : 'fill-teal stroke-teal animate-lookit')} cx={city.cx} cy={city.cy} r={3.28} />
      <circle className={cn('stroke-transparent [stroke-width:15px]', stop ? 'fill-red' : 'fill-teal')} cx={city.cx} cy={city.cy} r={3.28} />
    </>
  )
}

export default function MapClient() {
  const t = useTranslations('map')
  const tc = useTranslations('cities.names')
  const params = useSearchParams()
  const paneParam = params.get('pane')
  const [openPane, setOpenPane] = useState<string | null>(
    paneParam && DRAWER_CITIES.includes(paneParam) ? paneParam : null
  )
  const aspect = useMapAspect()
  const triggers = useRef<Record<string, SVGGElement | null>>({})

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

  const active = openPane ? getCity(openPane) : undefined

  return (
    <>
      <div className="relative h-dvh w-full overflow-hidden animate-fade-in bg-[url('/emea/assets/images/map/texture.jpg')] bg-fixed bg-cover bg-center bg-no-repeat">
        <EuropeMap className="block h-full w-full origin-center translate-y-16 scale-y-107 overflow-visible" preserveAspectRatio={aspect}>
          <polyline className="animate-draw fill-none stroke-teal opacity-80 [stroke-dasharray:2300] [stroke-dashoffset:2300] [stroke-width:0.7] motion-reduce:[stroke-dashoffset:0]" points={getRoutePoints()} />
          {CITIES.map(city => {
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
        </EuropeMap>
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
