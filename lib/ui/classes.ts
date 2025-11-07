import { cn } from '@/lib/utils'

/**
 * Common class combinations for consistent UI patterns
 * Premium, minimal, Vercel/Linear style
 */

export const ui = {
  // Cards
  card: cn(
    'rounded-lg border bg-card text-card-foreground',
    'transition-shadow duration-200'
  ),
  cardHover: cn(
    'rounded-lg border bg-card text-card-foreground',
    'transition-shadow duration-200',
    'hover:shadow-sm'
  ),
  
  // Buttons - minimal style
  buttonBase: cn(
    'inline-flex items-center justify-center',
    'rounded-lg text-sm font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50'
  ),
  
  // Inputs - clean borders
  inputBase: cn(
    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
    'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200'
  ),
  
  // Dividers
  divider: cn('border-t border-border'),
  dividerVertical: cn('border-l border-border'),
  
  // Badges/Tags
  badge: cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    'border border-border bg-muted'
  ),
  
  // Subtle background
  subtleBg: cn('bg-muted/50'),
  
  // Premium border
  premiumBorder: cn('border border-border/50'),
} as const

