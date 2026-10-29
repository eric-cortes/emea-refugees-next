'use client'

import { useTranslations } from 'next-intl'
import type { Period } from '@/constants/routes'

interface Props {
  period: Period
}

export default function MapLegend({ period }: Props) {
  const t = useTranslations('map')

  return (
    <div className="max-w-[calc(100vw-3.5rem)]">
      <p className="text-white">{t('note')}</p>
      <ul className="mt-2 flex flex-col gap-1.5 py-2">
        <li className="flex items-center gap-2">
          <span aria-hidden className="flex w-5 justify-center">
            <span className="h-2 w-2 rounded-full bg-teal" />
          </span>
          {t('legend.chapter')}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="flex w-5 justify-center">
            <span className="h-2 w-2 rounded-full bg-red" />
          </span>
          {t('legend.story')}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="flex w-5 justify-center">
            <span className="h-2 w-2 rounded-full bg-red" />
          </span>
          {t('legend.waypoint')}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 rounded-full bg-teal opacity-80" />
          {t('legend.main')}
        </li>
        {period.branches.length > 0 && (
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-px w-5 bg-teal opacity-50" />
            {t('legend.branch')}
          </li>
        )}
        {period.dashed && (
          <li className="flex items-center gap-2">
            <span aria-hidden className="w-5 border-t-2 border-dashed border-teal opacity-80" />
            {t('legend.attempt')}
          </li>
        )}
      </ul>
    </div>
  )
}
