'use client'

import { motion } from 'framer-motion'
import { Brain, Archive, MessageCircle, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Recommendation Engine',
      description: 'Discover your perfect cigar with our advanced AI that learns your preferences, considers your mood, and suggests the ideal smoke for any occasion.',
      link: '/ai-concierge',
      highlights: [
        'Personalized taste profiling',
        'Mood-based recommendations',
        'Occasion-specific pairings',
        'Continuous learning algorithm'
      ],
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Archive,
      title: 'Virtual Humidor',
      description: 'Manage your cigar collection digitally with aging reminders, optimal storage conditions, and smart inventory tracking.',
      link: '/humidor',
      highlights: [
        'Digital collection tracking',
        'Aging notifications',
        'Storage condition monitoring',
        'Investment value tracking'
      ],
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: MessageCircle,
      title: 'AI Concierge',
      description: '24/7 expert guidance from our AI sommelier for pairing advice, cigar education, and personalized recommendations.',
      link: '/ai-concierge',
      highlights: [
        '24/7 availability',
        'Expert pairing advice',
        'Cigar education',
        'Instant recommendations'
      ],
      gradient: 'from-blue-600 to-indigo-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="section-luxury bg-gradient-to-b from-background-secondary to-background-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-texture-leather opacity-30" />
      
      <div className="container-luxury relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-background-accent/50 backdrop-blur-sm rounded-full px-6 py-3 border border-luxury-gold/30 mb-6">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span className="text-luxury-gold font-medium">Powered by Artificial Intelligence</span>
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-luxury-subheading mb-6">
            Experience <span className="gold-gradient-text">Intelligent</span> Cigar Curation
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-luxury-body max-w-3xl mx-auto">
            Our cutting-edge AI transforms how you discover, collect, and enjoy cigars. 
            From personalized recommendations to intelligent collection management, 
            experience the future of cigar culture.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <Link href={feature.link}>
                  <div className="card-luxury h-full interactive-hover group-hover:shadow-gold transition-all duration-500">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-luxury-lg flex items-center justify-center shadow-luxury group-hover:shadow-gold-lg transition-all duration-500`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-luxury-gold/20 rounded-luxury-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-display text-xl font-semibold text-luxury-gold group-hover:text-luxury-gold-light transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2">
                        {feature.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-text-muted">
                            <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-text-muted/20">
                        <span className="text-luxury-gold font-medium group-hover:text-luxury-gold-light transition-colors">
                          Explore Feature
                        </span>
                        <ChevronRight className="w-5 h-5 text-luxury-gold group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold text-luxury-gold mb-4">
              Ready to Experience AI-Powered Curation?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of cigar enthusiasts who trust our AI to enhance their smoking experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-concierge" className="btn-primary">
                Try AI Concierge
              </Link>
              <Link href="/humidor" className="btn-secondary">
                Start Your Collection
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIFeatures