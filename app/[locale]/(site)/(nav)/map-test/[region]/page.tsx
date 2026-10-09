import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { TerrainMapClient } from '@/components/TerrainMap'
import { getRegion, REGIONS } from '@/constants/regions'
import { isLocale, routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'

interface Props {
  params: Promise<{ locale: string; region: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap(locale => REGIONS.map(region => ({ locale, region: region.id })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region: regionId } = await params
  const region = getRegion(regionId)
  if (!isLocale(locale) || !region) return {}
  const t = await getTranslations({ locale, namespace: 'mapTest' })
  const country = t(`countries.${region.id}`)
  return buildPageMetadata(
    locale,
    `/map-test/${region.id}`,
    t('title', { country }),
    t('metaDescription', { country })
  )
}

export default async function MapTestPage({ params }: Props) {
  const { locale, region: regionId } = await params
  const region = getRegion(regionId)
  if (!region) notFound()
  setRequestLocale(locale)

  return <TerrainMapClient regionId={region.id} />
}
