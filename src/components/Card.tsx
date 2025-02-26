import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {title && <h3 className="text-lg mb-3 font-newsreader">{title}</h3>}
      {children}
    </div>
  )
} 