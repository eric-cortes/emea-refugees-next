'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx'
import { usePathname } from '@/i18n/navigation'
import TransitionLink from '@/components/Layout/transition-link'
import { routing } from '@/i18n/routing'
import { cn } from '@/utils/cn'
import { IconButton } from '@/components/UI'
import { normalizePathname } from '@/utils/normalize-pathname'

export default function Nav() {
  const t = useTranslations('common.nav')
  const locale = useLocale()
  const pathname = usePathname()
  const currentPath = normalizePathname(pathname)
  const routeKey = `${locale}:${currentPath}`
  const [openFor, setOpenFor] = useState<string | null>(null)
  const open = openFor === routeKey
  const closeIfCurrent = (href: string) => {
    if (normalizePathname(href) === currentPath) {
      setOpenFor(null)
    }
  }

  return (
    <nav aria-label={t('menu')}>
      <IconButton
        variant="solid"
        onClick={() => setOpenFor(routeKey)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={t('menu')}
        className="fixed top-4 right-4 z-[60]"
      >
        <RxHamburgerMenu size={22} aria-hidden />
      </IconButton>
      <div
        id="site-menu"
        hidden={!open}
        className={cn(
          'fixed inset-0 z-[70] flex-col items-center justify-center gap-8 bg-black/90 text-white',
          open ? 'flex' : 'hidden'
        )}
      >
        <IconButton variant="ghost" onClick={() => setOpenFor(null)} aria-label={t('close')} className="absolute top-4 right-4">
          <RxCross2 size={24} aria-hidden />
        </IconButton>
        <ul className="flex flex-col items-center gap-4 text-2xl uppercase tracking-[0.2em]">
          <li>
            <TransitionLink href="/" onClick={() => closeIfCurrent('/')}>
              {t('home')}
            </TransitionLink>
          </li>
          <li>
            <TransitionLink href="/map" onClick={() => closeIfCurrent('/map')}>
              {t('map')}
            </TransitionLink>
          </li>
        </ul>
        <ul aria-label={t('language')} className="flex gap-4 text-sm uppercase tracking-widest">
          {routing.locales.map(l => (
            <li key={l}>
              <TransitionLink
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={l === locale ? 'true' : undefined}
                aria-label={l === 'en' ? t('english') : t('german')}
                onClick={() => {
                  if (l === locale) {
                    setOpenFor(null)
                  }
                }}
                className={cn('px-2 py-1', l === locale ? 'border-b-2 border-white' : 'opacity-70')}
              >
                {l}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <TransitionLink
          href="/impressum"
          onClick={() => closeIfCurrent('/impressum')}
          className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
        >
          {t('imprint')}
        </TransitionLink>
        <TransitionLink
          href="/sources"
          onClick={() => closeIfCurrent('/sources')}
          className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
        >
          {t('sources')}
        </TransitionLink>
      </div>
    </nav>
  )
}
