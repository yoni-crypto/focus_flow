import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function Section({ 
  children, 
  className,
  spacing = 'lg'
}: SectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-24',
    xl: 'py-24 sm:py-32',
  }

  return (
    <section
      className={cn(spacingClasses[spacing], className)}
    >
      {children}
    </section>
  )
}

