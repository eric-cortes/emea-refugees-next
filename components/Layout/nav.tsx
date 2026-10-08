'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/utils/cn'

export default function Nav() {
  const t = useTranslations('common.nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label={t('menu')}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={t('menu')}
        className="fixed top-4 right-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
      >
        <RxHamburgerMenu size={22} aria-hidden />
      </button>
      <div
        id="site-menu"
        hidden={!open}
        className={cn(
          'fixed inset-0 z-[70] flex-col items-center justify-center gap-8 bg-black/90 text-white',
          open ? 'flex' : 'hidden'
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t('close')}
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
        >
          <RxCross2 size={24} aria-hidden />
        </button>
        <ul className="flex flex-col items-center gap-4 text-2xl uppercase tracking-[0.2em]">
          <li>
            <Link href="/" onClick={() => setOpen(false)}>
              {t('home')}
            </Link>
          </li>
          <li>
            <Link href="/map" onClick={() => setOpen(false)}>
              {t('map')}
            </Link>
          </li>
        </ul>
        <ul aria-label={t('language')} className="flex gap-4 text-sm uppercase tracking-widest">
          {routing.locales.map(l => (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={l === locale ? 'true' : undefined}
                aria-label={l === 'en' ? t('english') : t('german')}
                onClick={() => setOpen(false)}
                className={cn('px-2 py-1', l === locale ? 'border-b-2 border-white' : 'opacity-70')}
              >
                {l}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
