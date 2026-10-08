import { getRequestConfig } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'

const NAMESPACES = ['common', 'map', 'cities'] as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = requested && isLocale(requested) ? requested : routing.defaultLocale

  const modules = await Promise.all(
    NAMESPACES.map(namespace => import(`../messages/${locale}/${namespace}.json`))
  )

  const messages = NAMESPACES.reduce<Record<string, unknown>>((acc, namespace, index) => {
    acc[namespace] = modules[index].default
    return acc
  }, {})

  return { locale, messages, timeZone: 'Europe/Berlin' }
})
