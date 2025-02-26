import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-8 ${className}`}>
      {children}
    </div>
  )
} 