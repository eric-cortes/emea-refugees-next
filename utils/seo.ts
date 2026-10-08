import { routing, type Locale } from '@/i18n/routing'
import { asset } from '@/utils/asset'

export const SITE_URL = 'https://example.com/emea'

const DEFAULT_IMAGE = '/assets/images/map/texture.jpg'

export function buildAlternates(locale: Locale, path: string) {
  const normalizedPath = path === '' || path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`

  const languages = Object.fromEntries(
    routing.locales.map(l => [l, `${SITE_URL}/${l}${normalizedPath}`])
  ) as Record<Locale, string>

  return {
    canonical: `${SITE_URL}/${locale}${normalizedPath}`,
    languages: {
      ...languages,
      'x-default': `${SITE_URL}/${routing.defaultLocale}${normalizedPath}`,
    },
  }
}

export function buildPageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  image: string = DEFAULT_IMAGE
) {
  const alternates = buildAlternates(locale, path)
  const imageUrl = `${SITE_URL.replace(/\/emea$/, '')}${asset(image)}`
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website' as const,
      title,
      description,
      url: alternates.canonical,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [imageUrl],
    },
  }
}
