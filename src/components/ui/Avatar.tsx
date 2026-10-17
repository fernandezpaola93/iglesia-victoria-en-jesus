import { HTMLAttributes, forwardRef, useState } from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  firstName?: string
  lastName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, firstName, lastName, size = 'md', ...props }, ref) => {
    const initials = (firstName?.charAt(0) || '?') + (lastName?.charAt(0) || '?')
    const [imgError, setImgError] = useState(false)
    const hasImage = src && src.length > 0 && !imgError

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full bg-primary-100', sizeClasses[size], className)}
        {...props}
      >
        {hasImage ? (
          <img
            src={src!}
            alt={alt || initials}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-medium text-primary-700 bg-primary-100">
            {initials.toUpperCase()}
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'