import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Footer } from '@/components/Layout'
import { SOURCE_GROUPS } from '@/constants/sources'
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
  const t = await getTranslations({ locale, namespace: 'sources' })
  return buildPageMetadata(locale, '/sources', t('title'), t('metaDescription'))
}

export default async function SourcesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('sources')

  return (
    <>
      <main className="min-h-dvh animate-fade-in bg-bg px-5 py-16 leading-normal text-white/80">
        <article className="mx-auto max-w-[44rem]">
          <h1 className="text-white">{t('title')}</h1>
          <p>{t('intro')}</p>
          {SOURCE_GROUPS.map(group => (
            <section key={group.key}>
              <h2 className="mt-8 mb-4 text-[1.6rem] text-white">{t(`groups.${group.key}`)}</h2>
              <ul className="list-disc space-y-2 pl-5">
                {group.items.map(item => (
                  <li key={item.url}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal">
                      {item.title}
                      <span className="sr-only"> {t('opensInNewTab')}</span>
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  )
}
