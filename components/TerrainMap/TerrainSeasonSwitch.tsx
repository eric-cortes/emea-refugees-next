'use client'

import { useTranslations } from 'next-intl'
import { SegmentedSwitch, type SegmentedSwitchOption } from '@/components/UI'
import { SEASONS, type Season } from './season-temperatures'

interface Props {
  season: Season | null
  onChange: (season: Season | null) => void
}

const CHOICES: readonly (Season | null)[] = [null, ...SEASONS]

export default function TerrainSeasonSwitch({ season, onChange }: Props) {
  const t = useTranslations('mapTest.season')
  const options: SegmentedSwitchOption<Season | 'elevation'>[] = CHOICES.map(choice => ({ value: choice ?? 'elevation', label: t(choice ?? 'elevation') }))

  return (
    <SegmentedSwitch
      label={t('label')}
      options={options}
      value={season ?? 'elevation'}
      onChange={value => onChange(value === 'elevation' ? null : value)}
    />
  )
}
