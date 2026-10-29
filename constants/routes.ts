import { getCity } from './cities'

export type PeriodId = 'summer2015' | 'winter2015' | 'y2018' | 'y2025'

export interface Waypoint {
  slug: string
  cx: number
  cy: number
  lat: number
  lng: number
}

export interface Period {
  id: PeriodId
  main: string[]
  branches: string[][]
  dashed?: string[]
}

export const WAYPOINTS: Waypoint[] = [
  { slug: 'gevgelija', cx: 358.3, cy: 306, lat: 41.1418, lng: 22.5025 },
  { slug: 'belgrade', cx: 327.6, cy: 250.49, lat: 44.7866, lng: 20.4489 },
  { slug: 'roszke', cx: 320.43, cy: 228.46, lat: 46.187, lng: 20.037 },
  { slug: 'munich', cx: 212.02, cy: 201.62, lat: 48.1351, lng: 11.582 },
  { slug: 'slavonski-brod', cx: 297.17, cy: 242.8, lat: 45.1603, lng: 18.0156 },
  { slug: 'dobova', cx: 266.09, cy: 235.19, lat: 45.8967, lng: 15.6522 },
  { slug: 'spielfeld', cx: 264.3, cy: 219.8, lat: 46.7092, lng: 15.6331 },
  { slug: 'passau', cx: 234.5, cy: 193.87, lat: 48.5667, lng: 13.4319 },
  { slug: 'albania', cx: 324.74, cy: 305.72, lat: 41.3275, lng: 19.8187 },
  { slug: 'montenegro', cx: 317.05, cy: 285.45, lat: 42.4304, lng: 19.2594 },
  { slug: 'sofia', cx: 366.5, cy: 282.27, lat: 42.6977, lng: 23.3219 },
  { slug: 'bulgaria-border', cx: 420.03, cy: 291.65, lat: 41.979, lng: 27.525 },
  { slug: 'croatian-border', cx: 268.67, cy: 251.45, lat: 44.87, lng: 15.74 },
]

export const PERIODS: Period[] = [
  {
    id: 'summer2015',
    main: ['lesbos', 'athen', 'gevgelija', 'belgrade', 'roszke', 'budapest', 'vienna', 'munich', 'berlin'],
    branches: [],
  },
  {
    id: 'winter2015',
    main: ['lesbos', 'athen', 'gevgelija', 'belgrade', 'slavonski-brod', 'dobova', 'spielfeld', 'passau', 'berlin'],
    branches: [],
  },
  {
    id: 'y2018',
    main: ['athen', 'gevgelija', 'belgrade', 'sarajevo', 'bihac'],
    branches: [['athen', 'albania', 'montenegro', 'sarajevo']],
    dashed: ['bihac', 'croatian-border'],
  },
  {
    id: 'y2025',
    main: ['bulgaria-border', 'sofia', 'belgrade', 'sarajevo'],
    branches: [
      ['athen', 'gevgelija', 'belgrade'],
      ['athen', 'albania', 'montenegro', 'sarajevo'],
    ],
  },
]

export const DEFAULT_PERIOD: PeriodId = 'summer2015'

export function isPeriodId(value: string | null | undefined): value is PeriodId {
  return PERIODS.some(period => period.id === value)
}

export function getPeriod(id: PeriodId): Period {
  return PERIODS.find(period => period.id === id) ?? PERIODS[0]
}

export function getWaypoint(slug: string): Waypoint | undefined {
  return WAYPOINTS.find(waypoint => waypoint.slug === slug)
}

export function getRoutePoints(slugs: string[]): string {
  return slugs
    .map(slug => {
      const point = getCity(slug) ?? getWaypoint(slug)
      return point ? `${point.cx} ${point.cy}` : ''
    })
    .join(' ')
}

export function getPeriodSlugs(period: Period): Set<string> {
  return new Set([...period.main, ...period.branches.flat(), ...(period.dashed ?? [])])
}
