import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '@/utils/cn'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant: 'solid' | 'ghost'
  size?: 'md' | 'lg'
  ref?: Ref<HTMLButtonElement>
}

export default function IconButton({ variant, size = 'md', className, ref, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={cn(
        'flex items-center justify-center rounded-full cursor-pointer',
        size === 'lg' ? 'h-12 w-12' : 'h-11 w-11',
        variant === 'solid' ? 'bg-black/70 text-white hover:bg-black' : 'hover:bg-white/10',
        className
      )}
    />
  )
}
