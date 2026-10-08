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
      <Suspense fallback={<div className="relative h-dvh w-full animate-fade-in bg-[url('/emea/assets/images/map/texture.jpg')] bg-fixed bg-cover bg-center bg-no-repeat" />}>
        <MapClient />
      </Suspense>
      <article className="mx-auto max-w-[44rem] animate-fade-in px-5 py-16 leading-normal [&_a]:text-teal min-[801px]:absolute min-[801px]:top-4 min-[801px]:right-4 min-[801px]:z-20 min-[801px]:mx-0 min-[801px]:w-[30%] min-[801px]:max-w-none">
        <header>
          <h1>{t('title')}</h1>
        </header>
        <section>
          <h2 className="mt-8 mb-4 text-[1.6rem]">{t('project.heading')}</h2>
          <p>{t('project.body1')}</p>
          <p>{t('project.body2')}</p>
          <p>{t('project.share')}</p>
          <p>
            <a href="https://missingmigrants.iom.int/" target="_blank" rel="noopener noreferrer">
              {t('project.link')}
            </a>
          </p>
          <h2 className="mt-8 mb-4 text-[1.6rem]">{t('credits.heading')}</h2>
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
