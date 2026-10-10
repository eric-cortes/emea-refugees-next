import { cn } from '@/utils/cn'

export const PILL_CLASS = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-0.5 text-xs text-white select-none'
export const PILL_INTERACTIVE_CLASS = 'pointer-events-auto cursor-pointer hover:bg-black'

export interface PillProps {
  name: string
  tone: 'teal' | 'red'
}

export default function Pill({ name, tone }: PillProps) {
  return (
    <>
      {name}
      <span aria-hidden className={cn('h-2 w-2 rounded-full', tone === 'red' ? 'bg-red' : 'bg-teal')} />
    </>
  )
}
