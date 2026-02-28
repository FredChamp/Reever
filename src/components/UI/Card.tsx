import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={['bg-white rounded-xl border border-gray-100 shadow-sm p-4', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={['flex items-center justify-between mb-3', className].join(' ')}>
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </h3>
  )
}
