import { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'number'
  className?: string
}

export default function Typography({ 
  children, 
  variant = 'body',
  className = ''
}: TypographyProps) {
  switch (variant) {
    case 'h1':
      return <h1 className={`text-4xl font-newsreader ${className}`}>{children}</h1>
    case 'h2':
      return <h2 className={`text-2xl font-newsreader ${className}`}>{children}</h2>
    case 'h3':
      return <h3 className={`text-xl font-newsreader ${className}`}>{children}</h3>
    case 'h4':
      return <h4 className={`text-lg font-newsreader ${className}`}>{children}</h4>
    case 'number':
      return <span className={`font-inter ${className}`}>{children}</span>
    case 'caption':
      return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
    default:
      return <p className={`font-newsreader ${className}`}>{children}</p>
  }
} 