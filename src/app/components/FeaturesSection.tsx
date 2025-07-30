'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Award, Users, Smartphone } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'PCI DSS compliant payments, age verification, and GDPR data protection ensure your privacy and security.',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with <2.5s mobile load times, CDN delivery, and seamless browsing experience.',
      color: 'text-yellow-400'
    },
    {
      icon: Globe,
      title: 'Global Collection',
      description: 'Access cigars from every major tobacco region worldwide with detailed provenance and authenticity.',
      color: 'text-blue-400'
    },
    {
      icon: Award,
      title: 'Expert Curation',
      description: 'Every cigar hand-selected by master blenders and tobacco sommeliers for exceptional quality.',
      color: 'text-purple-400'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of enthusiasts sharing reviews, experiences, and recommendations.',
      color: 'text-red-400'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect experience across all devices with progressive web app capabilities.',
      color: 'text-indigo-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="section-luxury bg-background-primary">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-luxury-subheading mb-6">
            Why Choose <span className="gold-gradient-text">Thee Cigar Maestro</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-luxury-body max-w-2xl mx-auto">
            Experience the perfect blend of tradition and innovation with our 
            comprehensive platform designed for the modern cigar enthusiast.
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
                <div className="card-glass h-full p-8 text-center interactive-hover">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-background-accent rounded-luxury-lg flex items-center justify-center group-hover:shadow-gold transition-all duration-500">
                      <IconComponent className={`w-10 h-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <div className="absolute inset-0 bg-luxury-gold/10 rounded-luxury-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-luxury-gold mb-4 group-hover:text-luxury-gold-light transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection