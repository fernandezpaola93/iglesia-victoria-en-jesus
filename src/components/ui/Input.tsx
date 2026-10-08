import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm placeholder:text-primary-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'transition-colors disabled:bg-primary-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm placeholder:text-primary-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'transition-colors disabled:bg-primary-50 disabled:cursor-not-allowed resize-y min-h-[100px]',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-primary-700 mb-1.5', className)}
        {...props}
      />
    )
  }
)
Label.displayName = 'Label'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'transition-colors disabled:bg-primary-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)
Select.displayName = 'Select'