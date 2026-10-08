import type { ReactNode } from 'react'
import { EUROPE_PATHS } from '@/constants/europe-paths'
import { cn } from '@/utils/cn'

interface EuropeMapProps {
  className?: string
  children?: ReactNode
  decorative?: boolean
  preserveAspectRatio?: string
}

export default function EuropeMap({ className, children, decorative = false, preserveAspectRatio }: EuropeMapProps) {
  return (
    <svg
      viewBox="0 0 1000 684"
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('europe-map', className)}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'group'}
    >
      {EUROPE_PATHS.map((country, index) => (
        <path key={country.id ?? index} id={country.id} className="countries" d={country.d} />
      ))}
      {children}
    </svg>
  )
}
