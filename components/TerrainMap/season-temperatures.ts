import { BufferAttribute, Color } from 'three'
import { elevationColour } from './elevation-colours'
import type { TerrainGeometryData } from './build-terrain-geometry'

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export const SEASONS: readonly Season[] = ['winter', 'spring', 'summer', 'autumn']

/** Usual seasonal temperatures at a region's marker city, plus the elevation (m) of that data point. */
interface SeasonClimate {
  referenceMetres: number
  means: Record<Season, number>
}

/**
 * Usual (1991–2020) seasonal mean temperatures in °C.
 * Source: Open-Meteo Historical Weather API (ERA5 reanalysis), daily mean 2 m temperature,
 * averaged per season (winter Dec–Feb, spring Mar–May, summer Jun–Aug, autumn Sep–Nov).
 * Each region is anchored at its marker city; other heights use the 6.5 °C per 1000 m lapse rate.
 */
export const SEASON_CLIMATE: Record<string, SeasonClimate> = {
  germany: { referenceMetres: 37, means: { winter: 1.4, spring: 9.3, summer: 18.9, autumn: 10.1 } },
  austria: { referenceMetres: 179, means: { winter: 0.9, spring: 10.6, summer: 20.5, autumn: 10.8 } },
  bosnia: { referenceMetres: 543, means: { winter: 0.9, spring: 9.7, summer: 19.9, autumn: 11.2 } },
  bihac: { referenceMetres: 225, means: { winter: 2.4, spring: 11.1, summer: 21.0, autumn: 12.2 } },
  greece: { referenceMetres: 92, means: { winter: 9.2, spring: 15.6, summer: 26.8, autumn: 18.8 } },
  lesbos: { referenceMetres: 18, means: { winter: 10.1, spring: 15.3, summer: 25.6, autumn: 18.7 } },
  syria: { referenceMetres: 693, means: { winter: 7.0, spring: 15.9, summer: 26.3, autumn: 18.8 } },
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
  '#b32a33',
  '#7f1d2d',
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

/** Writes the top-surface colours for `season` (elevation colours when null) into `out`, three floats per vertex. */
export function computeSeasonColours(terrain: TerrainGeometryData, regionId: string, season: Season | null, out: Float32Array): void {
  const { heights, surfaceCount } = terrain
  for (let v = 0; v < surfaceCount; v++) {
    if (season) colour.copy(bandColours[bandIndex(temperatureAt(regionId, season, heights[v]))])
    else elevationColour(heights[v], colour)
    out[v * 3] = colour.r
    out[v * 3 + 1] = colour.g
    out[v * 3 + 2] = colour.b
  }
}

/** Recolours the top surface in place: stepped temperature bands, or elevation colours when `season` is null. */
export function applySeasonColours(terrain: TerrainGeometryData, regionId: string, season: Season | null): void {
  const attribute = terrain.geometry.getAttribute('color') as BufferAttribute
  computeSeasonColours(terrain, regionId, season, attribute.array as Float32Array)
  attribute.needsUpdate = true
}
