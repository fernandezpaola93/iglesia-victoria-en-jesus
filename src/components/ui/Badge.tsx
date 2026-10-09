import { HTMLAttributes, forwardRef } from 'react'
import { cn, getMembershipStatusColor, getMinistryCategoryColor, getRoleColor } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status' | 'category' | 'role' | 'success' | 'warning' | 'destructive'
  value?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', value, children, ...props }, ref) => {
    let colorClass = 'bg-primary-100 text-primary-800'
    
    if (variant === 'success') {
      colorClass = 'bg-green-100 text-green-800'
    } else if (variant === 'warning') {
      colorClass = 'bg-yellow-100 text-yellow-800'
    } else if (variant === 'destructive') {
      colorClass = 'bg-red-100 text-red-800'
    } else if (variant === 'status' && value) {
      colorClass = getMembershipStatusColor(value)
    } else if (variant === 'category' && value) {
      colorClass = getMinistryCategoryColor(value)
    } else if (variant === 'role' && value) {
      colorClass = getRoleColor(value)
    }

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colorClass, className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'