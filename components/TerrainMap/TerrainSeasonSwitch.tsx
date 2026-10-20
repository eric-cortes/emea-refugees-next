'use client'

import { useRef, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'
import { SEASONS, type Season } from './season-temperatures'

interface Props {
  season: Season | null
  onChange: (season: Season | null) => void
}

const CHOICES: readonly (Season | null)[] = [null, ...SEASONS]

export default function TerrainSeasonSwitch({ season, onChange }: Props) {
  const t = useTranslations('mapTest.season')
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const next = (index + step + CHOICES.length) % CHOICES.length
    onChange(CHOICES[next])
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className="pointer-events-auto flex gap-1 max-w-full overflow-x-auto rounded-full bg-black/70 p-1 text-xs text-white/80"
    >
      {CHOICES.map((choice, index) => {
        const selected = choice === season
        return (
          <button
            key={choice ?? 'elevation'}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            ref={node => {
              buttons.current[index] = node
            }}
            onClick={() => onChange(choice)}
            onKeyDown={event => onKeyDown(event, index)}
            className={cn(
              'cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white',
              selected ? 'bg-white/20 text-white' : 'hover:bg-white/10'
            )}
          >
            {t(choice ?? 'elevation')}
          </button>
        )
      })}
    </div>
  )
}
