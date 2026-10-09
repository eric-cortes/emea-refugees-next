import { Color } from 'three'

export interface ElevationStop {
  metres: number
  colour: string
}

export const ELEVATION_COLOURS: readonly ElevationStop[] = [
  { metres: 0, colour: '#B4E4D6' },
  { metres: 400, colour: '#FFF6A9' },
  { metres: 1000, colour: '#FFCA88' },
  { metres: 2000, colour: '#DE7272' },
]

export const WALL_COLOUR = '#c8c6c2'

const stops = ELEVATION_COLOURS.map(stop => ({ metres: stop.metres, colour: new Color(stop.colour) }))

/** Writes the linear-space colour for an elevation in metres into `target`. */
export function elevationColour(metres: number, target: Color): Color {
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (metres <= first.metres) return target.copy(first.colour)
  if (metres >= last.metres) return target.copy(last.colour)
  for (let i = 1; i < stops.length; i++) {
    const upper = stops[i]
    if (metres <= upper.metres) {
      const lower = stops[i - 1]
      const t = (metres - lower.metres) / (upper.metres - lower.metres)
      return target.copy(lower.colour).lerp(upper.colour, t)
    }
  }
  return target.copy(last.colour)
}
