import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isLocale, routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/utils/seo'
import './../globals.css'

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
