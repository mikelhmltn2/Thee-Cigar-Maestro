'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube,
  Heart,
  Shield,
  Award
} from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    'Shop': [
      { name: 'Premium Cigars', href: '/cigars' },
      { name: 'Accessories', href: '/accessories' },
      { name: 'Gift Sets', href: '/gifts' },
      { name: 'Limited Editions', href: '/limited-editions' },
      { name: 'Sale', href: '/sale' }
    ],
    'Experience': [
      { name: 'AI Concierge', href: '/ai-concierge' },
      { name: 'Virtual Humidor', href: '/humidor' },
      { name: 'Cigar Pairings', href: '/pairings' },
      { name: 'Master Classes', href: '/education' },
      { name: 'Events', href: '/events' }
    ],
    'Learn': [
      { name: 'Cigar Guide', href: '/guide' },
      { name: 'Blog', href: '/blog' },
      { name: 'Flavor Profiles', href: '/flavors' },
      { name: 'Storage Tips', href: '/storage' },
      { name: 'Cigar History', href: '/history' }
    ],
    'Support': [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/theecigarmaestro' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/theecigarmaestro' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/theecigarmaestro' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@theecigarmaestro' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-t from-background-primary to-background-secondary border-t border-text-muted/20">
      <div className="container-luxury">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-gold rounded-luxury flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-300">
                  <span className="text-background-primary font-display font-bold text-xl">CM</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-luxury-gold">
                    Thee Cigar Maestro
                  </h3>
                  <p className="text-xs text-text-muted font-accent italic">
                    The Art. The Ritual. The Maestro.
                  </p>
                </div>
              </Link>

              <p className="text-text-secondary leading-relaxed">
                Experience the pinnacle of cigar culture with AI-driven recommendations, 
                luxury curation, and immersive digital experiences for every enthusiast.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-text-muted">
                  <Mail className="w-5 h-5 text-luxury-gold" />
                  <span>hello@theecigarmaestro.com</span>
                </div>
                <div className="flex items-center space-x-3 text-text-muted">
                  <Phone className="w-5 h-5 text-luxury-gold" />
                  <span>+1 (555) 123-CIGAR</span>
                </div>
                <div className="flex items-center space-x-3 text-text-muted">
                  <MapPin className="w-5 h-5 text-luxury-gold" />
                  <span>Miami, FL • New York, NY</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-background-accent hover:bg-luxury-gold border border-text-muted/30 hover:border-luxury-gold rounded-luxury flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-5 h-5 text-text-muted group-hover:text-background-primary transition-colors" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-display text-lg font-semibold text-luxury-gold">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-luxury-gold transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-8 border-t border-text-muted/20">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center space-x-2 text-text-muted">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-text-muted">
              <Award className="w-5 h-5 text-luxury-gold" />
              <span className="text-sm">Expert Curated</span>
            </div>
            <div className="flex items-center space-x-2 text-text-muted">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-sm">Age Verified 21+</span>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="py-8 border-t border-text-muted/20">
          <div className="text-center">
            <h4 className="font-display text-xl font-semibold text-luxury-gold mb-4">
              Stay Connected
            </h4>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Join our exclusive community for curated recommendations and insider access.
            </p>
            <Link href="#newsletter" className="btn-primary">
              Join Elite Circle
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-text-muted/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-text-muted">
              <span>© {currentYear} Thee Cigar Maestro. All rights reserved.</span>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-text-muted hover:text-luxury-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-muted hover:text-luxury-gold transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-text-muted hover:text-luxury-gold transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-text-muted hover:text-luxury-gold transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>

        {/* Age Verification Notice */}
        <div className="py-4 bg-background-accent/30 rounded-luxury mt-6">
          <p className="text-center text-sm text-text-muted">
            <strong className="text-luxury-gold">Age Verification Required:</strong> You must be 21+ to purchase tobacco products. 
            By using this site, you confirm you are of legal smoking age in your jurisdiction.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer