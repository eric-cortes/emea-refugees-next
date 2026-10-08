'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import type { City } from '@/constants/cities'
import { asset } from '@/utils/asset'
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

  return (
    <div className="city-split">
      <section className="map-country">
        <h4>{t('country')}</h4>
        <h4 className="dark" aria-hidden>
          {t('country')}
        </h4>
        <div className="svg-wrapper">
          <CountryMap cx={820} cy={470} />
        </div>
        {city.stats && <RouteInfo slug={city.slug} stats={city.stats} />}
      </section>
      <article className="city-article">
        <header>
          <div className="share">
            <a href="https://twitter.com/" aria-label={tShare('twitter')}>
              <FaTwitter size={22} aria-hidden />
            </a>
            <a href="https://facebook.com/" aria-label={tShare('facebook')}>
              <FaFacebook size={22} aria-hidden />
            </a>
          </div>
          <h1>{t('title')}</h1>
          <p className="meta">
            {t('byLabel')} <span>{t('author')}</span> | {t('date')}
          </p>
        </header>
        <div className="inner">
          <h2>{t('heading')}</h2>
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
        </div>
        <div className="image-grid">
          <div className="image-cell full">
            <Image src={asset(hero)} alt={alt} fill loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          {rest.map((src, index) => (
            <div key={index} className="image-cell">
              <Image src={asset(src)} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="inner clearfix">
          <div className="float-image left">
            <Image src={asset(floatLeft)} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <p>{t('p3')}</p>
          <div className="float-image right">
            <Image src={asset(floatRight)} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <p>{t('p4')}</p>
        </div>
      </article>
    </div>
  )
}
