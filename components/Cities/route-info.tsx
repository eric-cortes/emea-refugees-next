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
    <ul className="route-info">
      <li>
        <CountUp delay={1} end={stats.distance} />
        <span className="pre">{t('distance')}</span>
      </li>
      <li>
        <CountUp delay={1} end={stats.stranded2016} />
        <span className="pre">{t('stranded2016')}</span>
      </li>
      <li>
        <CountUp delay={1} end={stats.stranded2020} />
        <span className="pre">{t('stranded2020')}</span>
      </li>
    </ul>
  )
}
