export type CauseKey = 'vehicle' | 'drowning' | 'harsh' | 'violence' | 'unknown' | 'accident' | 'sickness' | 'drowningHarsh'

export interface RouteCauses {
  key: 'westernBalkans' | 'turkiyeLand'
  total: number
  causes: { key: CauseKey; value: number }[]
}

export const ROUTE_CAUSES: RouteCauses[] = [
  {
    key: 'westernBalkans',
    total: 448,
    causes: [
      { key: 'vehicle', value: 179 },
      { key: 'drowning', value: 137 },
      { key: 'harsh', value: 37 },
      { key: 'violence', value: 36 },
      { key: 'unknown', value: 28 },
      { key: 'accident', value: 15 },
      { key: 'sickness', value: 13 },
      { key: 'drowningHarsh', value: 3 },
    ],
  },
  {
    key: 'turkiyeLand',
    total: 317,
    causes: [
      { key: 'drowning', value: 124 },
      { key: 'harsh', value: 67 },
      { key: 'vehicle', value: 52 },
      { key: 'violence', value: 29 },
      { key: 'accident', value: 20 },
      { key: 'unknown', value: 18 },
      { key: 'sickness', value: 7 },
    ],
  },
]
