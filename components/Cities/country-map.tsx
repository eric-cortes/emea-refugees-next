import { WORLD_PATHS } from '@/constants/world-paths'

interface CountryMapProps {
  cx: number
  cy: number
}

export default function CountryMap({ cx, cy }: CountryMapProps) {
  return (
    <svg viewBox="0 0 1000 1360" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg" className="block h-full w-full animate-scale-up fill-land" aria-hidden>
      {WORLD_PATHS.map((country, index) => (
        <path key={index} d={country.d} />
      ))}
      <circle cx={cx} cy={cy} r={16} className="fill-teal opacity-50" />
      <circle cx={cx} cy={cy} r={10} className="fill-teal" />
    </svg>
  )
}
