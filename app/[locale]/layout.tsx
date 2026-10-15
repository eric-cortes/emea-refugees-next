import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isLocale, routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'
import './../globals.css'

function pick(source: AbstractIntlMessages, keys: string[]): AbstractIntlMessages {
  return Object.fromEntries(keys.filter(key => key in source).map(key => [key, source[key]]))
}

function pickClientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  const common = messages.common as AbstractIntlMessages
  const map = messages.map as AbstractIntlMessages
  const cities = messages.cities as AbstractIntlMessages
  const stats = Object.fromEntries(
    Object.entries(cities)
      .filter(([, value]) => typeof value === 'object' && 'stat' in value)
      .map(([slug, value]) => [slug, { stat: (value as AbstractIntlMessages).stat }])
  )

  return {
    common: pick(common, ['nav', 'intro', 'site', 'routeLoading', 'photoCredit', 'opensInNewTab']),
    map: pick(map, ['dot', 'drawer']),
    mapTest: messages.mapTest,
    cities: { ...pick(cities, ['names', 'statSourcePrefix']), ...stats },
  }
}

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'common.site' })
  return buildPageMetadata(locale, '/', t('title'), t('description'))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={pickClientMessages(messages)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
