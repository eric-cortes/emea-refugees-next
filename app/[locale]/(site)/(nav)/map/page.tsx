import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MapClient } from '@/components/Map'
import { isLocale } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'map' })
  const site = await getTranslations({ locale, namespace: 'common.site' })
  return buildPageMetadata(locale, '/map', t('title'), site('description'))
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('map')

  return (
    <>
      <Suspense fallback={<div className="map-stage" />}>
        <MapClient />
      </Suspense>
      <article className="map-text">
        <header>
          <h1>{t('title')}</h1>
        </header>
        <section className="inner">
          <h2>{t('project.heading')}</h2>
          <p>{t('project.body1')}</p>
          <p>{t('project.body2')}</p>
          <p>{t('project.share')}</p>
          <p>
            <a href="https://missingmigrants.iom.int/" target="_blank" rel="noopener noreferrer">
              {t('project.link')}
            </a>
          </p>
          <h2>{t('credits.heading')}</h2>
          <ul>
            <li>
              <a href="https://www.vice.com/de/contributor/alexandra-stanic">Alexandra Stanic</a>
            </li>
            <li>
              <a href="https://www.vice.com/de/contributor/alexandra-stanic">Simon de Beauvoir</a>
            </li>
          </ul>
        </section>
      </article>
    </>
  )
}
