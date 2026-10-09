'use client'

import { useTranslations } from 'next-intl'

export type TerrainStatusState = 'loading' | 'error' | 'unsupported' | 'lost'

interface Props {
  state: TerrainStatusState
  onRetry?: () => void
}

export default function TerrainStatus({ state, onRetry }: Props) {
  const t = useTranslations('mapTest.status')
  const canRetry = (state === 'error' || state === 'lost') && onRetry

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center text-white/80">
      <p role={state === 'loading' ? 'status' : 'alert'} className={state === 'loading' ? 'animate-pulse' : undefined}>
        {t(state)}
      </p>
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
