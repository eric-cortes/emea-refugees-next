'use client'

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface SegmentedSwitchOption<T extends string> {
  value: T
  label: ReactNode
}

export interface SegmentedSwitchProps<T extends string> {
  label: string
  options: readonly SegmentedSwitchOption<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedSwitch<T extends string>({ label, options, value, onChange }: SegmentedSwitchProps<T>) {
  const reduceMotion = useReducedMotion()
  const pillId = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="pointer-events-auto flex gap-2 max-w-full overflow-x-auto rounded-full bg-black/70 p-1 text-xs text-white/80"
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            ref={node => {
              buttons.current[index] = node
            }}
            onClick={() => onChange(option.value)}
            onKeyDown={event => onKeyDown(event, index)}
            className={cn(
              'relative cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white',
              selected ? 'text-white' : 'hover:bg-white/10'
            )}
          >
            {selected && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-full bg-white/20"
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
