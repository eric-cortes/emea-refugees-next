import { BufferAttribute, Color } from 'three'
import { elevationColour } from './elevation-colours'
import type { TerrainGeometryData } from './build-terrain-geometry'

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export const SEASONS: readonly Season[] = ['winter', 'spring', 'summer', 'autumn']

/** Area-mean temperatures per season, plus the mean elevation (m) they refer to. */
interface SeasonClimate {
  referenceMetres: number
  means: Record<Season, number>
}

/**
 * Usual (1991–2020) area-mean seasonal temperatures in °C.
 * Source: DWD, Deutscher Wetterdienst, area-mean temperatures Germany (mean elevation about 263 m).
 */
export const SEASON_CLIMATE: Record<string, SeasonClimate> = {
  germany: {
    referenceMetres: 263,
    means: { winter: 1.4, spring: 9.1, summer: 17.6, autumn: 9.3 },
  },
}

/** Standard lapse rate: 6.5 °C per 1000 m. */
export const LAPSE_RATE_PER_METRE = 0.0065

export const BAND_SIZE = 5

/** Colour of each 5 °C band; the first band starts at BAND_MIN. */
export const BAND_MIN = -20
export const BAND_COLOURS: readonly string[] = [
  '#5b3a9e',
  '#3a5fb4',
  '#4f8fd6',
  '#8cc4ec',
  '#e3f1f5',
  '#fff1a8',
  '#ffc766',
  '#f58a4b',
  '#d9483b',
]

export const hasSeasonData = (regionId: string) => regionId in SEASON_CLIMATE

export function temperatureAt(regionId: string, season: Season, metres: number): number {
  const climate = SEASON_CLIMATE[regionId]
  return climate.means[season] - LAPSE_RATE_PER_METRE * (metres - climate.referenceMetres)
}

/** Index into BAND_COLOURS for a temperature, clamped to the covered range. */
export function bandIndex(temperature: number): number {
  const index = Math.floor((temperature - BAND_MIN) / BAND_SIZE)
  return Math.min(BAND_COLOURS.length - 1, Math.max(0, index))
}

/** Lowest and highest band index that occur on the region's top surface. */
export function bandRange(terrain: TerrainGeometryData, regionId: string, season: Season): { first: number; last: number } {
  const { heights, used, gridCount, surfaceCount } = terrain
  let low = Infinity
  let high = -Infinity
  for (let v = 0; v < surfaceCount; v++) {
    if (v < gridCount && !used[v]) continue
    if (heights[v] < low) low = heights[v]
    if (heights[v] > high) high = heights[v]
  }
  if (low > high) return { first: 0, last: 0 }
  return {
    first: bandIndex(temperatureAt(regionId, season, high)),
    last: bandIndex(temperatureAt(regionId, season, low)),
  }
}

const bandColours = BAND_COLOURS.map(hex => new Color(hex))
const colour = new Color()

/** Recolours the top surface in place: stepped temperature bands, or elevation colours when `season` is null. */
export function applySeasonColours(terrain: TerrainGeometryData, regionId: string, season: Season | null): void {
  const { geometry, heights, surfaceCount } = terrain
  const attribute = geometry.getAttribute('color') as BufferAttribute
  const array = attribute.array as Float32Array
  for (let v = 0; v < surfaceCount; v++) {
    if (season) colour.copy(bandColours[bandIndex(temperatureAt(regionId, season, heights[v]))])
    else elevationColour(heights[v], colour)
    array[v * 3] = colour.r
    array[v * 3 + 1] = colour.g
    array[v * 3 + 2] = colour.b
  }
  attribute.needsUpdate = true
}
