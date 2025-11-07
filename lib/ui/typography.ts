import { cn } from '@/lib/utils'

/**
 * Typography utility classes for consistent text styling
 */

export const typography = {
  // Headings
  h1: 'text-3xl font-semibold tracking-tight lg:text-4xl',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
  h4: 'text-lg font-semibold tracking-tight',
  
  // Body text
  body: 'text-base leading-7',
  bodySm: 'text-sm leading-6',
  bodyLg: 'text-lg leading-8',
  
  // Labels and captions
  label: 'text-sm font-medium',
  caption: 'text-xs text-muted-foreground',
  
  // Utility classes
  muted: 'text-muted-foreground',
  emphasis: 'font-medium',
  bold: 'font-semibold',
} as const

/**
 * Typography component helper
 */
export function getTypographyClass(
  variant: keyof typeof typography,
  className?: string
) {
  return cn(typography[variant], className)
}

