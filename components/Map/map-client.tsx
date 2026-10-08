'use client'

import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CITIES, getCity, getRoutePoints, type City } from '@/constants/cities'
import { Link } from '@/i18n/navigation'
import CityDrawer from './city-drawer'
import EuropeMap from './europe-map'
import { useMapAspect } from './use-map-aspect'

const DRAWER_CITIES = ['lampedusa']

function Dot({ city }: { city: City }) {
  const cls = city.type === 'stop' ? 'red' : 'route'
  return (
    <>
      <circle className={`europe ${cls}`} cx={city.cx} cy={city.cy} r={3.28} />
      <circle className={`europe-small ${city.type === 'stop' ? 'red' : ''}`} cx={city.cx} cy={city.cy} r={3.28} />
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
      <div className="map-stage">
        <EuropeMap className="europe-map-full" preserveAspectRatio={aspect}>
          <polyline className="route-line" points={getRoutePoints()} />
          {CITIES.map(city => {
            if (city.hasPage) {
              return (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                  aria-label={t('dot.goToCity', { city: tc(city.slug) })}
                  className="map-dot"
                >
                  <Dot city={city} />
                </Link>
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
                  className="map-dot"
                  onClick={() => setOpenPane(city.slug)}
                  onKeyDown={event => onDotKey(event, city.slug)}
                >
                  <Dot city={city} />
                </g>
              )
            }
            return (
              <g key={city.slug} className="map-dot-static" aria-hidden>
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
