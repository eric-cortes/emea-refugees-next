import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export default function SectionHeading({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className={cn('mt-8 mb-4 text-[1.6rem]', className)} />
}
