'use client'

import CountUp from 'react-countup'
import { useLocale, useTranslations } from 'next-intl'
import type { CityStat } from '@/constants/cities'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'

interface RouteInfoProps {
  slug: string
  stat: CityStat
}

export default function RouteInfo({ slug, stat }: RouteInfoProps) {
  const t = useTranslations(`cities.${slug}.stat`)
  const tRoot = useTranslations('cities')
  const locale = useLocale()
  const german = locale === 'de'
  const reduceMotion = usePrefersReducedMotion()
  const decimals = stat.decimals ?? 0
  const finalValue = new Intl.NumberFormat(german ? 'de-DE' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(stat.value)

  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-3 flex w-[calc(100%-2rem)] max-w-[18rem] -translate-x-1/2 flex-col items-center text-center [overflow-wrap:anywhere]">
      <p className="m-0 text-[1.25rem] font-semibold">
        {t.has('prefix') && t('prefix')}
        <span aria-hidden="true">
          {reduceMotion ? (
            finalValue
          ) : (
            <CountUp
              delay={1}
              end={stat.value}
              decimals={decimals}
              separator={german ? '.' : ','}
              decimal={german ? ',' : '.'}
            />
          )}
        </span>
        <span className="sr-only">{finalValue}</span>
        {t.has('suffix') && t('suffix')}
      </p>
      <p className="m-0 text-[0.7rem] tracking-[0.1em] uppercase opacity-80">{t('label')}</p>
      <p className="m-0 mt-1 text-[0.65rem] opacity-60">
        {tRoot('statSourcePrefix')} {t('source')}
      </p>
    </div>
  )
}
