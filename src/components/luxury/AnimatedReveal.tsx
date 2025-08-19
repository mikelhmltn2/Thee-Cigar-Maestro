'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/utils/cn';

interface AnimatedRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  once?: boolean;
  threshold?: number;
}

const AnimatedReveal: React.FC<AnimatedRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  once = true,
  threshold = 0.1,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: 50 }),
      ...(direction === 'down' && { y: -50 }),
      ...(direction === 'left' && { x: 50 }),
      ...(direction === 'right' && { x: -50 }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom luxury easing
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedReveal;
