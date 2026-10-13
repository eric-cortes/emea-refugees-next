import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CityView } from '@/components/Cities'
import { getCity, PAGE_SLUGS } from '@/constants/cities'
import { isLocale, routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap(locale => PAGE_SLUGS.map(slug => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const city = getCity(slug)
  if (!isLocale(locale) || !city?.hasPage) return {}
  const t = await getTranslations({ locale, namespace: 'cities' })
  const name = t(`names.${slug}`)
  return buildPageMetadata(
    locale,
    `/cities/${slug}`,
    name,
    `${name}. ${t('meta.descriptionSuffix')}`,
    city.images[0]?.src
  )
}

export default async function CityPage({ params }: Props) {
  const { locale, slug } = await params
  const city = getCity(slug)
  if (!city?.hasPage) notFound()
  setRequestLocale(locale)

  return <CityView city={city} />
}
