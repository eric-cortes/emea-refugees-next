import { isPeriodId, type PeriodId } from '@/constants/routes'

const KEY = 'map-period'

export function readStoredPeriod(): PeriodId | null {
  try {
    const value = window.sessionStorage.getItem(KEY)
    return isPeriodId(value) ? value : null
  } catch {
    return null
  }
}

export function storePeriod(period: PeriodId) {
  try {
    window.sessionStorage.setItem(KEY, period)
  } catch {
    return
  }
}
