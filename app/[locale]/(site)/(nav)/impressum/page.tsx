import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Footer } from '@/components/Layout'
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
    <>
      <main className="min-h-dvh animate-fade-in bg-bg px-5 py-16 leading-normal text-white/80">
        <article className="mx-auto max-w-[44rem]">
          <h1 className="text-white">{t('title')}</h1>
          <section id="credits" className="scroll-mt-8">
            <h2 className="mt-8 mb-4 text-[1.6rem] text-white">{t('credits.title')}</h2>
            <ul className="list-disc space-y-2 pl-5">
              {CREDIT_KEYS.map(key => (
                <li key={key}>{t(`credits.${key}`)}</li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
