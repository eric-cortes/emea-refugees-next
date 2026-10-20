import { cn } from '@/utils/cn'

export interface TooltipProps {
  label: string
  side?: 'bottom' | 'right'
}

export default function Tooltip({ label, side = 'bottom' }: TooltipProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute bg-black/70 whitespace-nowrap rounded-full px-3 py-1 text-[10px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 motion-reduce:transition-none',
        side === 'right' ? 'left-full top-1/2 ml-2 -translate-y-1/2' : 'left-1/2 top-full mt-2 -translate-x-1/2'
      )}
    >
      {label}
    </span>
  )
}
