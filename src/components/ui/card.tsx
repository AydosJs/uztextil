import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children?: ReactNode
  image?: string
  imageAlt?: string
}

export const Card = ({ className, children, image, imageAlt = "Card image" }: CardProps) => {
  const backgroundImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXoAAADcCAYAAABf0C4yAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA5SURBVHgB7cEBAQAAAICQ/q/uCAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwMWCCAAELm8PFAAAAASUVORK5CYII="

  return (
    <div
      className={cn(
        "relative w-full max-w-[366px] h-[220px] rounded-[32px] border overflow-hidden",
        "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.04)]",
        "shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08)]",
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}
      {children && (
        <div className="relative z-20 p-4 h-full">
          {children}
        </div>
      )}
    </div>
  )
}