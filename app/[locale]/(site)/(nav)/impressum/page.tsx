import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContentPage, SectionHeading } from '@/components/UI'
import { isLocale, routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'

interface Props {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'impressum' })
  return buildPageMetadata(locale, '/impressum', t('title'), t('metaDescription'))
}

const CREDIT_KEYS = ['elevation', 'europe', 'srtm', 'etopo', 'borders'] as const

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('impressum')

  return (
    <ContentPage>
      <h1 className="text-white">{t('title')}</h1>
      <section id="credits" className="scroll-mt-8">
        <SectionHeading className="text-white">{t('credits.title')}</SectionHeading>
        <ul className="list-disc space-y-2 pl-5">
          {CREDIT_KEYS.map(key => (
            <li key={key}>{t(`credits.${key}`)}</li>
          ))}
        </ul>
      </section>
    </ContentPage>
  )
}
