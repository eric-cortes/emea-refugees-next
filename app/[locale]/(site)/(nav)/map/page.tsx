import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CauseChart, MapClient } from '@/components/Map'
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
      <Suspense fallback={<div className="relative h-dvh w-full animate-fade-in bg-[url('/assets/images/map/texture.jpg')] bg-fixed bg-cover bg-center bg-no-repeat" />}>
        <MapClient />
      </Suspense>
      <article className="mx-auto max-w-176 animate-fade-in px-5 py-16 text-[0.9375rem] leading-tight [&_a]:text-teal min-[801px]:absolute min-[801px]:top-4 min-[801px]:right-4 min-[801px]:z-20 min-[801px]:mx-0 min-[801px]:w-[30%] min-[801px]:max-w-none">
        <h1 className="sr-only">{t('title')}</h1>
        <CauseChart />
      </article>
    </>
  )
}
