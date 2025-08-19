'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GoldGradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  variant?: 'default' | 'premium' | 'subtle';
}

const GoldGradientText: React.FC<GoldGradientTextProps> = ({
  children,
  className,
  animate = true,
  variant = 'default',
}) => {
  const variants = {
    default: 'from-luxury-gold via-luxury-gold-light to-luxury-gold',
    premium: 'from-luxury-gold-dark via-luxury-gold to-luxury-gold-light',
    subtle: 'from-text-accent via-luxury-gold to-text-accent',
  };

  return (
    <span className={cn('relative inline-block', className)}>
      <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', variants[variant])}>
        {children}
      </span>

      {animate && (
        <motion.span
          className={cn(
            'absolute inset-0 bg-gradient-to-r bg-clip-text text-transparent opacity-0',
            variants[variant]
          )}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.span>
      )}

      {/* Shimmer effect */}
      {animate && (
        <motion.div
          className='absolute inset-0 overflow-hidden'
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 2,
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 blur-sm' />
        </motion.div>
      )}
    </span>
  );
};

export default GoldGradientText;
