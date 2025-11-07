import { Container } from './container'
import { Section } from './section'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  sectionSpacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PageWrapper({
  children,
  className,
  containerSize = 'xl',
  sectionSpacing = 'lg',
}: PageWrapperProps) {
  return (
    <Section spacing={sectionSpacing} className={className}>
      <Container size={containerSize}>{children}</Container>
    </Section>
  )
}

