import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-primary-200 text-primary-600',
          'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'transition-colors cursor-pointer',
          className
        )}
        {...props}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'