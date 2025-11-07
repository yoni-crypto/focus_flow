'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BackgroundImageProps {
  src: string
  alt: string
  className?: string
  opacity?: number
}

export function BackgroundImage({ src, alt, className = '', opacity = 20 }: BackgroundImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return null
  }

  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity: opacity / 100 }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  )
}

