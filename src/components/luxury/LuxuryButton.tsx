'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/utils/cn'

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  icon?: React.ReactNode
  loading?: boolean
  magnetic?: boolean
  shimmer?: boolean
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    children, 
    icon,
    loading = false,
    magnetic = true,
    shimmer = true,
    disabled,
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    
    // Magnetic effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 300, damping: 20 })
    const springY = useSpring(y, { stiffness: 300, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!magnetic || disabled) return
      
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = (e.clientX - centerX) * 0.1
      const distanceY = (e.clientY - centerY) * 0.1
      
      x.set(distanceX)
      y.set(distanceY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
      setIsHovered(false)
    }

    const variants = {
      primary: 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-background-primary shadow-gold hover:shadow-gold-lg',
      secondary: 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-background-primary',
      ghost: 'text-text-accent hover:text-luxury-gold-light',
      premium: 'bg-gradient-to-br from-luxury-gold via-luxury-gold-light to-luxury-gold text-background-primary shadow-luxury hover:shadow-luxury-lg'
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    }

    return (
      <motion.button
        ref={buttonRef}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-luxury transition-all duration-300 ease-luxury',
          'focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 focus:ring-offset-background-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
      >
        {/* Shimmer effect */}
        {shimmer && variant !== 'ghost' && (
          <motion.div
            className="absolute inset-0 rounded-luxury overflow-hidden"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </motion.div>
        )}

        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-luxury bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Button content */}
        <span className={cn('relative z-10 flex items-center gap-2', loading && 'opacity-0')}>
          {icon && <span className="w-5 h-5">{icon}</span>}
          {children}
        </span>

        {/* Hover glow effect */}
        {variant !== 'ghost' && (
          <motion.div
            className="absolute inset-0 rounded-luxury opacity-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    )
  }
)

LuxuryButton.displayName = 'LuxuryButton'

export default LuxuryButton