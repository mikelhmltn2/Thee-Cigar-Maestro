'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { LuxuryButton, GoldGradientText } from '@/components/luxury';
import { ChevronDown, Sparkles, Award, Globe } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background layers with parallax */}
      <motion.div className='absolute inset-0 z-0' style={{ y: heroY }}>
        {/* Gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-accent' />

        {/* Animated gradient orbs */}
        <motion.div
          className='absolute top-1/4 -left-1/4 w-96 h-96 bg-luxury-gold/20 rounded-full blur-3xl'
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-1/4 -right-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl'
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Luxury pattern overlay */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='h-full w-full'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className='relative z-10 container mx-auto px-6 text-center'
        style={{ y: textY, opacity }}
      >
        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-8'
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 rounded-full'>
            <Award className='w-4 h-4 text-luxury-gold' />
            <span className='text-sm text-luxury-gold font-medium'>
              Est. 2024 • Premium Collection
            </span>
          </div>
        </motion.div>

        {/* Main heading with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        >
          <h1 className='text-6xl md:text-7xl lg:text-8xl font-display mb-6'>
            <span className='block text-text-primary mb-2'>Experience</span>
            <GoldGradientText className='block' variant='premium'>
              Luxury Redefined
            </GoldGradientText>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className='text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed'
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
        >
          Discover the world's finest cigars through AI-powered curation, immersive 3D experiences,
          and exclusive member benefits
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'
        >
          <LuxuryButton size='lg' variant='premium' icon={<Sparkles className='w-5 h-5' />}>
            Start Your Journey
          </LuxuryButton>
          <LuxuryButton size='lg' variant='secondary' icon={<Globe className='w-5 h-5' />}>
            Explore Collection
          </LuxuryButton>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'
        >
          {[
            { icon: '🤖', title: 'AI Concierge', desc: 'Personalized recommendations' },
            { icon: '🌍', title: 'Global Sourcing', desc: 'Curated from 5 continents' },
            { icon: '🏆', title: 'VIP Access', desc: 'Exclusive member benefits' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className='text-center'
            >
              <div className='text-4xl mb-2'>{feature.icon}</div>
              <h3 className='text-luxury-gold font-medium mb-1'>{feature.title}</h3>
              <p className='text-sm text-text-muted'>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity }}
      >
        <ChevronDown className='w-8 h-8 text-luxury-gold' />
      </motion.div>

      {/* Floating cigar elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-32 h-2 bg-gradient-to-r from-luxury-mahogany to-luxury-leather rounded-full opacity-10'
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
