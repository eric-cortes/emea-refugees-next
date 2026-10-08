'use client'

import CountUp from 'react-countup'
import { useTranslations } from 'next-intl'
import type { CityStats } from '@/constants/cities'

interface RouteInfoProps {
  slug: string
  stats: CityStats
}

export default function RouteInfo({ slug, stats }: RouteInfoProps) {
  const t = useTranslations(`cities.${slug}.stats`)

  return (
    <ul className="absolute bottom-8 left-1/2 -translate-x-1/2 z-3 m-0 flex list-none gap-6 p-0 text-center text-[1.25rem] font-semibold">
      <li>
        <CountUp delay={1} end={stats.distance} />
        <span className="block text-[0.7rem] font-normal tracking-[0.1em] uppercase opacity-80">{t('distance')}</span>
      </li>
      <li>
        <CountUp delay={1} end={stats.stranded2016} />
        <span className="block whitespace-nowrap text-[0.7rem] font-normal tracking-[0.1em] uppercase opacity-80">{t.rich('stranded2016', { br: () => <br /> })}</span>
      </li>
      <li>
        <CountUp delay={1} end={stats.stranded2020} />
        <span className="block whitespace-nowrap text-[0.7rem] font-normal tracking-[0.1em] uppercase opacity-80">{t.rich('stranded2020', { br: () => <br /> })}</span>
      </li>
    </ul>
  )
}
