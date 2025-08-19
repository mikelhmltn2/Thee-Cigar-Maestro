'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Marcus Rodriguez',
      title: 'Cigar Lounge Owner',
      location: 'Miami, FL',
      avatar: '/avatars/marcus.jpg',
      rating: 5,
      text: 'The AI recommendations are spot-on. It perfectly understood my preference for medium-bodied Nicaraguan cigars and introduced me to several new favorites.',
      featured: true,
    },
    {
      id: 2,
      name: 'Catherine Chen',
      title: 'Tobacco Sommelier',
      location: 'New York, NY',
      avatar: '/avatars/catherine.jpg',
      rating: 5,
      text: 'The virtual humidor feature is a game-changer. I can track my entire collection and never miss optimal aging windows. Brilliant platform.',
      featured: false,
    },
    {
      id: 3,
      name: 'James Thompson',
      title: 'Collector',
      location: 'London, UK',
      avatar: '/avatars/james.jpg',
      rating: 5,
      text: 'Exceptional quality and service. The luxury experience they provide matches the premium cigars in their collection. Highly recommended.',
      featured: false,
    },
    {
      id: 4,
      name: 'Isabella Fontana',
      title: 'Wine & Cigar Enthusiast',
      location: 'Tuscany, Italy',
      avatar: '/avatars/isabella.jpg',
      rating: 5,
      text: 'The pairing recommendations are exquisite. The AI suggested a perfect cognac pairing that elevated my entire evening experience.',
      featured: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className='section-luxury bg-gradient-to-b from-background-secondary to-background-primary relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-texture-leather opacity-20' />

      <div className='container-luxury relative z-10'>
        <motion.div
          className='text-center mb-16'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className='text-luxury-subheading mb-6'>
            Trusted by <span className='gold-gradient-text'>Connoisseurs</span> Worldwide
          </motion.h2>
          <motion.p variants={itemVariants} className='text-luxury-body max-w-2xl mx-auto'>
            Join thousands of cigar enthusiasts who have elevated their experience with our
            AI-powered platform and expert curation.
          </motion.p>
        </motion.div>

        <motion.div
          className='grid lg:grid-cols-2 gap-8 mb-16'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {/* Featured Testimonial */}
          {testimonials
            .filter(t => t.featured)
            .map(testimonial => (
              <motion.div key={testimonial.id} variants={itemVariants} className='lg:col-span-2'>
                <div className='card-luxury p-12 text-center relative overflow-hidden'>
                  {/* Background Quote */}
                  <Quote className='absolute top-8 left-8 w-16 h-16 text-luxury-gold/20' />
                  <Quote className='absolute bottom-8 right-8 w-16 h-16 text-luxury-gold/20 rotate-180' />

                  {/* Rating */}
                  <div className='flex justify-center mb-6'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className='w-6 h-6 text-luxury-gold fill-current' />
                    ))}
                  </div>

                  {/* Text */}
                  <blockquote className='text-2xl font-accent italic text-text-primary leading-relaxed mb-8 max-w-4xl mx-auto'>
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className='flex items-center justify-center space-x-4'>
                    <div className='w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center text-background-primary font-display font-bold text-xl'>
                      {testimonial.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div className='text-left'>
                      <h4 className='font-display text-luxury-gold font-semibold text-lg'>
                        {testimonial.name}
                      </h4>
                      <p className='text-text-muted'>{testimonial.title}</p>
                      <p className='text-text-muted text-sm'>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Regular Testimonials */}
          {testimonials
            .filter(t => !t.featured)
            .map(testimonial => (
              <motion.div key={testimonial.id} variants={itemVariants} className='group'>
                <div className='card-glass h-full p-8 interactive-hover'>
                  {/* Rating */}
                  <div className='flex mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className='w-4 h-4 text-luxury-gold fill-current' />
                    ))}
                  </div>

                  {/* Text */}
                  <blockquote className='text-text-secondary leading-relaxed mb-6 font-accent italic'>
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-background-primary font-display font-bold'>
                      {testimonial.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h4 className='font-display text-luxury-gold font-semibold'>
                        {testimonial.name}
                      </h4>
                      <p className='text-text-muted text-sm'>{testimonial.title}</p>
                      <p className='text-text-muted text-xs'>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {[
            { number: '10,000+', label: 'Premium Cigars' },
            { number: '50+', label: 'Countries' },
            { number: '25,000+', label: 'Happy Customers' },
            { number: '4.9', label: 'Average Rating' },
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <h3 className='text-4xl font-display font-bold text-luxury-gold mb-2'>
                {stat.number}
              </h3>
              <p className='text-text-muted font-medium'>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
