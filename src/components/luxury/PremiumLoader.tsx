'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'cigar' | 'luxury';
  className?: string;
  text?: string;
}

const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  size = 'md',
  variant = 'luxury',
  className,
  text,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={cn(
              'border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full',
              sizes[size]
            )}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );

      case 'dots':
        return (
          <div className='flex space-x-2'>
            {[0, 1, 2].map(index => (
              <motion.div
                key={index}
                className='w-3 h-3 bg-luxury-gold rounded-full'
                animate={{
                  y: [0, -10, 0],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
            ))}
          </div>
        );

      case 'cigar':
        return (
          <div className='relative'>
            <motion.div
              className={cn(
                'bg-gradient-to-r from-luxury-mahogany to-luxury-leather rounded-full',
                sizes[size]
              )}
              style={{ width: '60px', height: '12px' }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div className='w-1 h-1 bg-luxury-gold rounded-full' />
            </motion.div>
          </div>
        );

      case 'luxury':
      default:
        return (
          <div className='relative'>
            <motion.div
              className={cn(
                'absolute inset-0 border-2 border-luxury-gold/20 rounded-full',
                sizes[size]
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={cn(
                'border-2 border-transparent border-t-luxury-gold border-r-luxury-gold rounded-full',
                sizes[size]
              )}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              animate={{
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className='w-2 h-2 bg-luxury-gold rounded-full' />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {renderLoader()}
      {text && (
        <motion.p
          className='text-luxury-gold text-sm font-medium'
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default PremiumLoader;
