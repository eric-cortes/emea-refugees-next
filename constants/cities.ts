export type CityType = 'route' | 'stop'

export interface CityStats {
  distance: number
  stranded2016: number
  stranded2020: number
}

export interface City {
  slug: string
  cx: number
  cy: number
  type: CityType
  hasPage: boolean
  images: string[]
  video?: string
  stats?: CityStats
  lat?: number
  lng?: number
}

const VIDEO = '/assets/video/short.mp4'

const BERLIN_IMAGES: string[] = [
  '/assets/images/berlin/pic01.jpg',
  '/assets/images/berlin/pic02.jpg',
  '/assets/images/berlin/pic03.jpg',
  '/assets/images/berlin/pic04.jpg',
  '/assets/images/berlin/pic05.jpg',
  '/assets/images/berlin/pic06.jpg',
  '/assets/images/berlin/pic07.jpg',
  '/assets/images/berlin/pic09.jpg',
]

const BERLIN_STATS: CityStats = { distance: 2446, stranded2016: 946, stranded2020: 1446 }

export const CITIES: City[] = [
  {
    slug: 'berlin',
    cx: 219.94,
    cy: 133.38,
    type: 'route',
    hasPage: true,
    images: BERLIN_IMAGES,
    stats: BERLIN_STATS,
    lat: 52.52,
    lng: 13.405,
  },
  { slug: 'vienna', cx: 272.93, cy: 197.4, type: 'route', hasPage: true, images: BERLIN_IMAGES, stats: BERLIN_STATS, lat: 48.2082, lng: 16.3738 },
  { slug: 'sarajevo', cx: 302.96, cy: 267.37, type: 'route', hasPage: true, images: BERLIN_IMAGES, stats: BERLIN_STATS, lat: 43.8563, lng: 18.4131 },
  { slug: 'athen', cx: 379.96, cy: 356.37, type: 'route', hasPage: true, images: BERLIN_IMAGES, stats: BERLIN_STATS, lat: 37.9838, lng: 23.7275 },
  { slug: 'lesbos', cx: 410.95, cy: 337.38, type: 'route', hasPage: true, images: BERLIN_IMAGES, stats: BERLIN_STATS, lat: 39.1067, lng: 26.555 },
  { slug: 'damascus', cx: 545.94, cy: 422.38, type: 'route', hasPage: true, images: BERLIN_IMAGES, stats: BERLIN_STATS, lat: 33.5138, lng: 36.2765 },
  { slug: 'lampedusa', cx: 236.2, cy: 391.4, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'rome', cx: 226.69, cy: 292.38, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'budapest', cx: 301.75, cy: 208.17, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'prag', cx: 242.15, cy: 170.25, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'warsaw', cx: 309.75, cy: 136.17, type: 'stop', hasPage: false, images: [], video: VIDEO },
]

export const ROUTE_ORDER = ['lesbos', 'athen', 'sarajevo', 'vienna', 'berlin'] as const

export const PAGE_SLUGS: string[] = CITIES.filter(city => city.hasPage).map(city => city.slug)

export function getCity(slug: string): City | undefined {
  return CITIES.find(city => city.slug === slug)
}

export function getRoutePoints(): string {
  return ROUTE_ORDER.map(slug => {
    const city = getCity(slug)
    return city ? `${city.cx} ${city.cy}` : ''
  }).join(' ')
}
