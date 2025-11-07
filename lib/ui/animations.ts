/**
 * Animation utilities - subtle, smooth, premium
 * Following Vercel/Linear style
 */

export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-150',
  
  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top-2 duration-200',
  slideInFromBottom: 'animate-in slide-in-from-bottom-2 duration-200',
  slideInFromLeft: 'animate-in slide-in-from-left-2 duration-200',
  slideInFromRight: 'animate-in slide-in-from-right-2 duration-200',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-150',
  
  // Transition utilities
  transition: 'transition-all duration-200 ease-out',
  transitionFast: 'transition-all duration-150 ease-out',
  transitionSlow: 'transition-all duration-300 ease-out',
} as const

/**
 * Hover effects - minimal and clean
 */
export const hover = {
  lift: 'hover:-translate-y-0.5 transition-transform duration-200',
  scale: 'hover:scale-105 transition-transform duration-200',
  opacity: 'hover:opacity-80 transition-opacity duration-200',
} as const

