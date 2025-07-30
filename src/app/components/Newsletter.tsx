'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Gift, Star, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
      toast.success('Welcome to the Cigar Maestro family!')
      setEmail('')
    }, 1500)
  }

  const benefits = [
    'Exclusive cigar releases and pre-orders',
    'Weekly AI-curated recommendations',
    'Master class invitations and events',
    'Special member pricing and offers'
  ]

  return (
    <section className="section-luxury bg-gradient-to-br from-background-secondary via-background-accent to-background-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-texture-leather opacity-30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />
      
      <div className="container-luxury relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {!isSubscribed ? (
            <>
              <div className="mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-luxury-xl mb-6 shadow-gold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="w-10 h-10 text-background-primary" />
                </motion.div>
                
                <h2 className="text-luxury-subheading mb-6">
                  Join the <span className="gold-gradient-text">Elite Circle</span>
                </h2>
                
                <p className="text-luxury-body max-w-2xl mx-auto mb-8">
                  Become part of our exclusive community and receive curated cigar recommendations, 
                  insider access to rare releases, and invitations to prestigious events.
                </p>
              </div>

              {/* Benefits */}
              <motion.div
                className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <div className="w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-background-primary" />
                    </div>
                    <span className="text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* Newsletter Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="input-luxury w-full"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-background-primary border-t-transparent rounded-full animate-spin" />
                        <span>Joining...</span>
                      </div>
                    ) : (
                      'Join Elite Circle'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-text-muted mt-4">
                  By subscribing, you agree to our privacy policy. Unsubscribe at any time.
                </p>
              </motion.form>

              {/* Special Offer */}
              <motion.div
                className="mt-8 p-6 card-glass max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Gift className="w-5 h-5 text-luxury-gold" />
                  <span className="font-display text-luxury-gold font-semibold">
                    Welcome Gift
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  New subscribers receive a complimentary cigar cutter and 
                  15% off their first purchase.
                </p>
              </motion.div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="py-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-luxury-subheading mb-6">
                Welcome to the <span className="gold-gradient-text">Elite Circle</span>!
              </h2>
              
              <p className="text-luxury-body max-w-2xl mx-auto mb-8">
                You're now part of our exclusive community. Check your email for a 
                special welcome gift and your first curated recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubscribed(false)}
                  className="btn-secondary"
                >
                  Subscribe Another Email
                </button>
                <button className="btn-primary">
                  Explore Collection
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter