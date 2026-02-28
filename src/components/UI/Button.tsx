import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-water-600 text-white hover:bg-water-700 focus-visible:ring-water-500',
  secondary:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-400',
  ghost:
    'text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus-visible:ring-red-400',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-3.5 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-lg',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center gap-1.5 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
