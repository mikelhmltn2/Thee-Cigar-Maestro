'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Sparkles } from 'lucide-react'

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0)
  
  const heroImages = [
    '/images/hero-cigars-1.jpg',
    '/images/hero-lounge-1.jpg',
    '/images/hero-collection-1.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background-primary via-background-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-background-primary/50" />
      </div>

      {/* Hero Pattern */}
      <div className="absolute inset-0 bg-hero-pattern z-10" />

      {/* Content */}
      <motion.div
        className="relative z-20 container-luxury text-center lg:text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-background-secondary/50 backdrop-blur-sm rounded-full px-4 py-2 border border-luxury-gold/30">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-sm font-medium text-luxury-gold">AI-Powered Recommendations</span>
              </div>
              
              <h1 className="text-luxury-heading text-balance">
                The <span className="gold-gradient-text">Art</span>. <br />
                The <span className="gold-gradient-text">Ritual</span>. <br />
                The <span className="gold-gradient-text">Maestro</span>.
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-luxury-body max-w-2xl"
            >
              Experience the pinnacle of cigar culture with AI-driven recommendations, 
              luxury curation, and immersive digital experiences. From novice to connoisseur, 
              discover your perfect cigar journey.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/ai-concierge" className="btn-primary group">
                Discover Your Perfect Cigar
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="btn-secondary group">
                <Play className="mr-2 w-5 h-5" />
                Watch Experience
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-text-muted"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
                <span>10,000+ Premium Cigars</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
                <span>AI-Powered Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
                <span>Expert Curation</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Feature Preview */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-lg">
              {/* Floating Cards */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-0 right-0 card-glass p-4 w-48"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <h4 className="font-display text-luxury-gold text-sm mb-2">Today's Recommendation</h4>
                  <p className="text-xs text-text-secondary">Cohiba Behike 56 - Perfect for your evening ritual</p>
                </motion.div>

                <motion.div
                  className="absolute bottom-8 left-0 card-glass p-4 w-44"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <h4 className="font-display text-luxury-gold text-sm mb-2">Virtual Humidor</h4>
                  <p className="text-xs text-text-secondary">32 cigars aging perfectly in your collection</p>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 card-glass p-6 w-56"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-background-primary" />
                    </div>
                    <h4 className="font-display text-luxury-gold text-sm mb-2">AI Concierge</h4>
                    <p className="text-xs text-text-secondary">Ready to help with pairings and recommendations</p>
                  </div>
                </motion.div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-luxury-gold/10 rounded-full blur-3xl animate-glow-pulse" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center space-y-2 text-text-muted">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-text-muted/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-luxury-gold rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection