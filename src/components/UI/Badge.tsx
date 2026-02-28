import type { ReactNode } from 'react'

type Color = 'blue' | 'amber' | 'green' | 'gray' | 'red'

interface BadgeProps {
  color?: Color
  children: ReactNode
}

const colorClasses: Record<Color, string> = {
  blue: 'bg-water-100 text-water-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-100 text-red-700',
}

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClasses[color],
      ].join(' ')}
    >
      {children}
    </span>
  )
}
