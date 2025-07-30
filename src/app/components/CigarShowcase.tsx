'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import Link from 'next/link'

const CigarShowcase = () => {
  const [hoveredCigar, setHoveredCigar] = useState<number | null>(null)

  const featuredCigars = [
    {
      id: 1,
      name: 'Cohiba Behike 56',
      brand: 'Cohiba',
      origin: 'Cuba',
      wrapper: 'Medio Tiempo',
      strength: 'Full',
      price: 45.00,
      originalPrice: 55.00,
      rating: 4.9,
      reviews: 127,
      image: '/images/cohiba-behike.jpg',
      description: 'The pinnacle of Cuban craftsmanship with rare Medio Tiempo leaves',
      features: ['Limited Edition', 'Hand-rolled', 'Aged 5+ years'],
      flavor: 'Rich chocolate, cedar, with hints of coffee and spice'
    },
    {
      id: 2,
      name: 'Arturo Fuente Opus X',
      brand: 'Arturo Fuente',
      origin: 'Dominican Republic',
      wrapper: 'Rosado',
      strength: 'Medium-Full',
      price: 35.00,
      rating: 4.8,
      reviews: 89,
      image: '/images/opus-x.jpg',
      description: 'Legendary cigar grown in volcanic soil of the Dominican Republic',
      features: ['Estate Grown', 'Chateau Series', 'Premium'],
      flavor: 'Spicy cedar, leather, with notes of pepper and earth'
    },
    {
      id: 3,
      name: 'Padron 1964 Anniversary',
      brand: 'Padron',
      origin: 'Nicaragua',
      wrapper: 'Natural',
      strength: 'Medium',
      price: 28.00,
      rating: 4.7,
      reviews: 156,
      image: '/images/padron-1964.jpg',
      description: 'Anniversary series celebrating 30 years of excellence',
      features: ['Box-pressed', 'Aged tobacco', 'Hand-selected'],
      flavor: 'Creamy nuts, vanilla, with subtle chocolate undertones'
    }
  ]

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
    hidden: { opacity: 0, y: 30 },
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
    <section className="section-luxury bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-luxury-subheading mb-6">
            Featured <span className="gold-gradient-text">Premium</span> Cigars
          </motion.h2>
          <motion.p variants={itemVariants} className="text-luxury-body max-w-2xl mx-auto">
            Discover our hand-selected collection of the world's finest cigars, 
            curated by experts and loved by connoisseurs.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredCigars.map((cigar) => (
            <motion.div
              key={cigar.id}
              variants={itemVariants}
              className="group"
              onMouseEnter={() => setHoveredCigar(cigar.id)}
              onMouseLeave={() => setHoveredCigar(null)}
            >
              <div className="card-luxury h-full overflow-hidden interactive-hover">
                {/* Image Container */}
                <div className="relative h-64 mb-6 rounded-luxury-lg overflow-hidden bg-gradient-to-br from-background-accent to-background-leather">
                  {/* Placeholder for cigar image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-luxury-leather to-luxury-deep-brown opacity-80" />
                  
                  {/* Features badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {cigar.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-luxury-gold text-background-primary text-xs font-medium rounded-luxury"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price badge */}
                  {cigar.originalPrice && (
                    <div className="absolute top-4 right-4 bg-background-secondary/90 backdrop-blur-sm rounded-luxury px-3 py-1">
                      <span className="text-text-muted text-xs line-through">${cigar.originalPrice}</span>
                      <span className="text-luxury-gold font-bold ml-1">${cigar.price}</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className={`absolute inset-0 bg-background-primary/80 flex items-center justify-center gap-4 transition-all duration-300 ${
                    hoveredCigar === cigar.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button className="w-12 h-12 bg-luxury-gold hover:bg-luxury-gold-light text-background-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-background-secondary hover:bg-background-accent text-luxury-gold border border-luxury-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-background-secondary hover:bg-background-accent text-luxury-gold border border-luxury-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(cigar.rating)
                              ? 'text-luxury-gold fill-current'
                              : 'text-text-muted'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-text-muted ml-2">
                        {cigar.rating} ({cigar.reviews})
                      </span>
                    </div>
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                      {cigar.origin}
                    </span>
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <h3 className="font-display text-xl font-semibold text-luxury-gold mb-1 group-hover:text-luxury-gold-light transition-colors">
                      {cigar.name}
                    </h3>
                    <p className="text-text-muted font-medium">{cigar.brand}</p>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {cigar.description}
                  </p>

                  {/* Flavor Profile */}
                  <div className="bg-background-accent/30 rounded-luxury p-3">
                    <h4 className="text-xs font-medium text-text-accent uppercase tracking-wider mb-2">
                      Flavor Profile
                    </h4>
                    <p className="text-sm text-text-secondary">{cigar.flavor}</p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Wrapper:</span>
                      <span className="text-text-primary ml-2 font-medium">{cigar.wrapper}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Strength:</span>
                      <span className="text-text-primary ml-2 font-medium">{cigar.strength}</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-text-muted/20">
                    <div className="flex items-center space-x-2">
                      {cigar.originalPrice && (
                        <span className="text-text-muted text-sm line-through">
                          ${cigar.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-luxury-gold">
                        ${cigar.price}
                      </span>
                    </div>
                    <Link
                      href={`/cigars/${cigar.id}`}
                      className="btn-primary text-sm px-6 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link href="/cigars" className="btn-secondary">
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CigarShowcase