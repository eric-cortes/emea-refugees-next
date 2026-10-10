import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContentPage, ExternalLink, SectionHeading } from '@/components/UI'
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
  const tc = await getTranslations('common')

  return (
    <ContentPage>
      <h1 className="text-white">{t('title')}</h1>
      <p>{t('intro')}</p>
      {SOURCE_GROUPS.map(group => (
        <section key={group.key}>
          <SectionHeading className="text-white">{t(`groups.${group.key}`)}</SectionHeading>
          <ul className="list-disc space-y-2 pl-5">
            {group.items.map(item => (
              <li key={item.url}>
                <ExternalLink href={item.url} newTabLabel={tc('opensInNewTab')} className="text-teal">
                  {item.title}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ContentPage>
  )
}
