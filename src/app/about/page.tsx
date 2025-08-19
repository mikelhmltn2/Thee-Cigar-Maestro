'use client';

import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Award, Users, Globe, Leaf, Shield, Star } from 'lucide-react';

const stats = [
  { label: 'Years of Excellence', value: '25+' },
  { label: 'Premium Cigars', value: '500+' },
  { label: 'Happy Connoisseurs', value: '10K+' },
  { label: 'Countries Served', value: '45' },
];

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We curate only the finest cigars from renowned manufacturers worldwide.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building connections among cigar enthusiasts through shared experiences.',
  },
  {
    icon: Globe,
    title: 'Heritage',
    description: 'Preserving and celebrating the rich traditions of cigar craftsmanship.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Supporting sustainable farming practices and fair trade initiatives.',
  },
  {
    icon: Shield,
    title: 'Authenticity',
    description: 'Guaranteed authentic products with complete provenance tracking.',
  },
  {
    icon: Star,
    title: 'Innovation',
    description: 'Pioneering AI technology to enhance your cigar selection experience.',
  },
];

const team = [
  {
    name: 'Michael Hamilton',
    role: 'Founder & CEO',
    bio: 'Master tobacconist with 30 years of experience in luxury cigars.',
    image: '/images/team/michael.jpg',
  },
  {
    name: 'Isabella Rodriguez',
    role: 'Head Sommelier',
    bio: 'Expert in cigar and beverage pairings with international certifications.',
    image: '/images/team/isabella.jpg',
  },
  {
    name: 'James Chen',
    role: 'AI Technology Lead',
    bio: 'Pioneering machine learning applications for personalized recommendations.',
    image: '/images/team/james.jpg',
  },
  {
    name: 'Sofia Martinez',
    role: 'Customer Experience Director',
    bio: 'Dedicated to creating unforgettable experiences for our members.',
    image: '/images/team/sofia.jpg',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-accent-copper/10" />
        </div>
        <div className="container-luxury relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-luxury-heading mb-6">
              The Art of <span className="gold-gradient-text">Cigar Excellence</span>
            </h1>
            <p className="text-luxury-body text-text-secondary leading-relaxed">
              Welcome to Thee Cigar Maestro, where tradition meets innovation. We are more than just a
              cigar retailer – we are curators of exceptional experiences, bringing you the world's
              finest cigars enhanced by cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-accent-gold/20">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-luxury">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-luxury-subheading mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Founded in 1998, Thee Cigar Maestro began as a small boutique in the heart of Miami,
                  driven by a passion for exceptional cigars and the culture surrounding them. Our
                  founder, Michael Hamilton, a master tobacconist with decades of experience, envisioned
                  a place where both novices and connoisseurs could discover their perfect smoke.
                </p>
                <p>
                  Over the years, we've evolved from a local favorite to a globally recognized authority
                  in premium cigars. Our commitment to quality has never wavered – every cigar in our
                  collection is personally selected, ensuring only the finest make it to our humidors.
                </p>
                <p>
                  Today, we're pioneering the integration of AI technology with traditional expertise,
                  creating personalized experiences that honor the craft while embracing innovation. Our
                  AI concierge learns your preferences, suggests perfect pairings, and helps you explore
                  new horizons in the world of premium cigars.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-luxury-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-accent-copper/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚬</div>
                  <p className="text-xl font-display italic text-text-secondary">
                    "Excellence is not a destination, it's a journey we take with every cigar."
                  </p>
                  <p className="mt-4 text-accent-gold">- Michael Hamilton, Founder</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-luxury bg-background-accent/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-luxury-subheading mb-6">Our Values</h2>
            <p className="text-luxury-body text-text-secondary max-w-3xl mx-auto">
              These principles guide everything we do, from selecting cigars to serving our community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background-secondary rounded-luxury-xl p-8 border border-accent-gold/20 hover:border-accent-gold/40 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-background-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{value.title}</h3>
                  <p className="text-text-secondary">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-luxury">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-luxury-subheading mb-6">Meet Our Experts</h2>
            <p className="text-luxury-body text-text-secondary max-w-3xl mx-auto">
              Our team combines decades of expertise with innovative thinking to deliver an
              unparalleled cigar experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-gold/20 to-accent-copper/20 flex items-center justify-center">
                  <div className="text-4xl">👤</div>
                </div>
                <h3 className="text-xl font-display font-bold mb-1">{member.name}</h3>
                <p className="text-accent-gold text-sm mb-3">{member.role}</p>
                <p className="text-text-secondary text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-luxury bg-gradient-to-br from-accent-gold/10 to-accent-copper/10">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-luxury-subheading mb-6">Begin Your Journey</h2>
            <p className="text-luxury-body text-text-secondary mb-8">
              Join thousands of connoisseurs who have discovered their perfect cigar through our
              personalized AI recommendations and expert curation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/products" className="btn-luxury-primary">
                Explore Collection
              </a>
              <a href="/contact" className="btn-luxury-secondary">
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}