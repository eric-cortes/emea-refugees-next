import type { ReactNode } from 'react'
import { EUROPE_PATHS } from '@/constants/europe-paths'

interface EuropeMapProps {
  className?: string
  children?: ReactNode
  decorative?: boolean
  preserveAspectRatio?: string
  viewBox?: string
}

const FILL_BY_ID: Record<string, string> = {
  DE: 'fill-[#181818]',
  BA: 'fill-[#181818]',
  SY: 'fill-[#181818]',
  AT: 'fill-[#222]',
  GR: 'fill-[#222]',
}

export default function EuropeMap({ className, children, decorative = false, preserveAspectRatio, viewBox = '0 0 1000 684' }: EuropeMapProps) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'group'}
    >
      {EUROPE_PATHS.map((country, index) => (
        <path key={country.id ?? index} id={country.id} className={(country.id && FILL_BY_ID[country.id]) || 'fill-land'} d={country.d} />
      ))}
      {children}
    </svg>
  )
}
