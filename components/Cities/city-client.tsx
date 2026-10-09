'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import type { City } from '@/constants/cities'
import { getRegionForCity } from '@/constants/regions'
import { asset } from '@/utils/asset'
import { useMediaQuery } from '@/utils/use-media-query'
import { TerrainCanvasClient } from '@/components/TerrainMap'
import CountryMap from './country-map'
import RouteInfo from './route-info'

interface CityClientProps {
  city: City
}

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

  return (
    <div className="md:grid md:grid-cols-2 md:items-start">
      <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
        <div className={region ? 'absolute inset-0 overflow-hidden md:hidden' : 'absolute inset-0 overflow-hidden'}>
          <CountryMap cx={820} cy={470} />
        </div>
        {region && desktop && (
          <div className="absolute inset-0">
            <TerrainCanvasClient regionId={region.id} zoom={false} />
          </div>
        )}
        {city.stats && <RouteInfo slug={city.slug} stats={city.stats} />}
      </section>
      <article className="mx-auto max-w-[44rem] px-5 py-16 leading-normal md:m-0 md:min-h-dvh md:max-w-none md:bg-panel md:px-12 [&_a]:text-teal">
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
          <h2 className="mt-8 mb-4 text-[1.6rem]">{t('heading')}</h2>
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
        </div>
        <div className="my-8 grid grid-cols-3 gap-x-3 gap-y-11">
          <div className="col-span-3">
            <Image src={asset(hero)} alt={alt} width={0} height={0} loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full rounded-md" />
          </div>
          {rest.map((src, index) => (
            <div key={index}>
              <Image src={asset(src)} alt={alt} width={0} height={0} sizes="(min-width: 768px) 17vw, 33vw" className="block h-auto w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="flow-root">
          <p>
            <span className="relative top-1 float-left mr-8 mb-8 block w-full max-w-[40%]">
              <Image src={asset(floatLeft)} alt="" width={0} height={0} sizes="(min-width: 768px) 20vw, 40vw" className="block h-auto w-full rounded-md" />
            </span>
            {t('p3')}
          </p>
          <p>
            <span className="relative top-1 float-right mb-8 ml-8 block w-full max-w-[40%]">
              <Image src={asset(floatRight)} alt="" width={0} height={0} sizes="(min-width: 768px) 20vw, 40vw" className="block h-auto w-full rounded-md" />
            </span>
            {t('p4')}
          </p>
        </div>
      </article>
    </div>
  )
}
