'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient' | 'premium';
  hover3D?: boolean;
  glow?: boolean;
  border?: boolean;
}

const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className,
  variant = 'glass',
  hover3D = true,
  glow = true,
  border = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / 5);
    y.set((e.clientY - centerY) / 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const variants = {
    glass: 'bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl',
    solid: 'bg-background-secondary',
    gradient: 'bg-gradient-to-br from-background-secondary to-background-accent',
    premium:
      'bg-gradient-to-br from-luxury-gold/10 via-background-secondary to-luxury-gold/5 backdrop-blur-xl',
  };

  const borderStyles = border ? 'border border-luxury-gold/20' : '';
  const glowStyles = glow && isHovered ? 'shadow-gold-lg' : 'shadow-luxury';

  return (
    <motion.div
      className={cn(
        'relative rounded-luxury-lg overflow-hidden',
        'transition-all duration-500 ease-luxury',
        variants[variant],
        borderStyles,
        glowStyles,
        className
      )}
      style={{
        rotateX: hover3D ? rotateX : 0,
        rotateY: hover3D ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: hover3D ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Gradient overlay for depth */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none' />

      {/* Animated border gradient */}
      {border && variant === 'premium' && (
        <motion.div
          className='absolute inset-0 rounded-luxury-lg'
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Content */}
      <div className='relative z-10 p-8' style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>

      {/* Hover shine effect */}
      {isHovered && (
        <motion.div
          className='absolute inset-0 pointer-events-none'
          initial={{ opacity: 0, x: '-100%', rotate: -45 }}
          animate={{ opacity: 0.3, x: '100%', rotate: -45 }}
          transition={{ duration: 0.6 }}
        >
          <div className='h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
        </motion.div>
      )}
    </motion.div>
  );
};

export default LuxuryCard;
