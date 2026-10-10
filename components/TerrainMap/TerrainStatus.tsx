'use client'

import { useTranslations } from 'next-intl'

export type TerrainStatusState = 'loading' | 'error' | 'unsupported' | 'lost'

interface Props {
  state: TerrainStatusState
  progress?: number
  onRetry?: () => void
}

export default function TerrainStatus({ state, progress = 0, onRetry }: Props) {
  const t = useTranslations('mapTest.status')
  const canRetry = (state === 'error' || state === 'lost') && onRetry

  if (state === 'loading') {
    const value = Math.min(Math.max(progress, 0), 100)
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="status" className="text-sm text-white/70">
          {t('loading')}
        </p>
        <div className="w-[min(420px,80vw)]">
          <div
            role="progressbar"
            aria-label={t('loading')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            className="h-[3px] w-full overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="h-full bg-teal transition-[width] duration-500 ease-in-out motion-reduce:transition-none"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center text-white/80">
      <p role="alert">{t(state)}</p>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full border border-white/30 px-5 py-2 text-sm text-white hover:bg-white/10"
        >
          {t(state === 'lost' ? 'reload' : 'retry')}
        </button>
      )}
    </div>
  )
}
