import { cn } from '@/utils/cn'

export interface MapDotProps {
  cx: number
  cy: number
  tone: 'teal' | 'red'
  variant: 'pulse' | 'halo'
  r?: number
}

export default function MapDot({ cx, cy, tone, variant, r }: MapDotProps) {
  const red = tone === 'red'
  if (variant === 'halo') {
    const radius = r ?? 5
    return (
      <>
        <circle cx={cx} cy={cy} r={radius * 1.6} className={cn('opacity-50', red ? 'fill-red' : 'fill-teal')} />
        <circle cx={cx} cy={cy} r={radius} className={red ? 'fill-red' : 'fill-teal'} />
      </>
    )
  }
  const radius = r ?? 3.28
  return (
    <>
      <circle className={cn('opacity-40', red ? 'fill-red stroke-red' : 'fill-teal stroke-teal animate-lookit')} cx={cx} cy={cy} r={radius} />
      <circle className={cn('stroke-transparent [stroke-width:15px]', red ? 'fill-red' : 'fill-teal')} cx={cx} cy={cy} r={radius} />
    </>
  )
}
