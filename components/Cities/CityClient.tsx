'use client'

import { useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import type { City } from '@/constants/cities'
import { getRegionForCity } from '@/constants/regions'
import { useMediaQuery } from '@/utils/use-media-query'
import { TerrainCanvasClient } from '@/components/TerrainMap'
import EuropeMap from '@/components/Map/EuropeMap'
import CityDrawer from '@/components/Map/CityDrawer'
import { MapDot, SectionHeading } from '@/components/UI'
import CountryMap from './CountryMap'
import RouteInfo from './RouteInfo'

interface CityClientProps {
  city: City
}

const PARAGRAPH_KEYS = Array.from({ length: 12 }, (_, index) => `p${index + 1}`)
const GRID_ORDER = [0, 1, 5, 3, 4, 5, 6, 3, 7, 3]

export default function CityClient({ city }: CityClientProps) {
  const t = useTranslations(`cities.${city.slug}`)
  const tShare = useTranslations('common.share')
  const alt = t('imageAlt')
  const [hero, ...rest] = GRID_ORDER.map(index => city.images[index % city.images.length])
  const floatLeft = city.images[2]
  const floatRight = city.images[1]
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
      <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
        <div className={region ? 'absolute inset-0 overflow-hidden md:hidden' : 'absolute inset-0 overflow-hidden'}>
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
      <article className="mx-auto max-w-176 px-5 py-16 leading-snug md:m-4 md:h-[calc(100dvh-2rem)] md:max-w-none md:overflow-y-auto md:relative md:z-45 md:rounded-2xl md:bg-panel md:px-12 [&_a]:text-teal">
        <header>
          <div className="flex gap-4">
            <a href="https://twitter.com/" aria-label={tShare('twitter')}>
              <FaTwitter size={22} aria-hidden />
            </a>
            <a href="https://facebook.com/" aria-label={tShare('facebook')}>
              <FaFacebook size={22} aria-hidden />
            </a>
          </div>
          <h1 className="my-2 text-[3rem]">{t('title')}</h1>
          <p>
            {t('byLabel')} <span className="text-teal">{t('author')}</span> | {t('date')}
          </p>
        </header>
        <div>
          <SectionHeading>{t('heading')}</SectionHeading>
          <div className="space-y-4">{PARAGRAPH_KEYS.map(key => t.has(key) && <p key={key}>{t(key)}</p>)}</div>
        </div>
        <div className="my-8 grid grid-cols-3 gap-x-3 gap-y-11">
          <div className="col-span-3">
            <Image src={hero} alt={alt} width={0} height={0} loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full rounded-md" />
          </div>
          {rest.map((src, index) => (
            <div key={index}>
              <Image src={src} alt={alt} width={0} height={0} sizes="(min-width: 768px) 17vw, 33vw" className="block h-auto w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mb-8 grid grid-cols-2 gap-x-3">
          <Image src={floatLeft} alt={alt} width={0} height={0} sizes="(min-width: 768px) 25vw, 50vw" className="block h-auto w-full rounded-md" />
          <Image src={floatRight} alt={alt} width={0} height={0} sizes="(min-width: 768px) 25vw, 50vw" className="block h-auto w-full rounded-md" />
        </div>
      </article>
      <CityDrawer
        citySlug={poi}
        title={poi ? tNames(poi) : ''}
        imageSrc={activePoi?.image}
        imageAlt={poi ? tDrawer(`images.${poi}`) : undefined}
        onClose={() => setPoi(null)}
      />
    </div>
  )
}
