'use client'

import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import type { City } from '@/constants/cities'
import { getRegionForCity } from '@/constants/regions'
import { useMediaQuery } from '@/utils/use-media-query'
import { TerrainCanvasClient } from '@/components/TerrainMap'
import EuropeMap from '@/components/Map/EuropeMap'
import CityDrawer from '@/components/Map/CityDrawer'
import { MapDot } from '@/components/UI'
import CountryMap from './CountryMap'
import RouteInfo from './RouteInfo'

interface CityMapProps {
  city: City
  children: ReactNode
}

export default function CityMap({ city, children }: CityMapProps) {
  const region = getRegionForCity(city.slug)
  const desktop = useMediaQuery('(min-width: 768px)')
  const tNames = useTranslations('cities.names')
  const tMap = useTranslations('map')
  const tDrawer = useTranslations('map.drawer')
  const [poi, setPoi] = useState<string | null>(null)
  const pois = region?.pois ?? []
  const activePoi = pois.find(item => item.id === poi)

  const onPoiKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setPoi(id)
    }
  }

  return (
    <div className="md:grid md:grid-cols-2 md:items-start">
      <section className="relative h-[80vh] animate-fade-in bg-bg md:sticky md:top-0 md:h-dvh">
        <div className={region ? 'absolute inset-0 md:hidden' : 'absolute inset-0'}>
          {city.slug === 'berlin' ? (
            <CountryMap cx={820} cy={470} />
          ) : (
            <EuropeMap decorative={pois.length === 0} viewBox={`${city.cx - 100} ${city.cy - 100} 200 200`} preserveAspectRatio="xMidYMid meet" className="block h-full w-full animate-scale-up fill-land">
              <MapDot cx={city.cx} cy={city.cy} tone="teal" variant="halo" r={2} />
              {pois.map(item => (
                <g
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-label={tMap('dot.openCity', { city: tNames(item.id) })}
                  aria-haspopup="dialog"
                  className="cursor-pointer"
                  onClick={() => setPoi(item.id)}
                  onKeyDown={event => onPoiKey(event, item.id)}
                >
                  <circle cx={item.cx} cy={item.cy} r={6} className="fill-transparent" />
                  <MapDot cx={item.cx} cy={item.cy} tone="red" variant="halo" r={2} />
                </g>
              ))}
            </EuropeMap>
          )}
        </div>
        {region && desktop && (
          <div className="absolute inset-0">
            <TerrainCanvasClient regionId={region.id} zoom={false} onPoiSelect={setPoi} />
          </div>
        )}
        {city.stat && <RouteInfo slug={city.slug} stat={city.stat} />}
      </section>
      {children}
      <CityDrawer
        citySlug={poi}
        title={poi ? tNames(poi) : ''}
        image={activePoi?.image}
        imageAlt={poi ? tDrawer(`images.${poi}`) : undefined}
        onClose={() => setPoi(null)}
      />
    </div>
  )
}
