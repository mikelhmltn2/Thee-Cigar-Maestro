import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CigarShowcase from './components/CigarShowcase';
import AIFeatures from './components/AIFeatures';
import TestimonialsSection from './components/TestimonialsSection';
import Newsletter from './components/Newsletter';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Dynamic imports for performance
const CigarExplorer3D = dynamic(() => import('./components/CigarExplorer3D'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export default function HomePage() {
  return (
    <main className='relative overflow-hidden'>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* 3D Cigar Explorer Section */}
      <section className='section-luxury bg-gradient-to-b from-background-primary to-background-secondary'>
        <div className='container-luxury'>
          <div className='text-center mb-16'>
            <h2 className='text-luxury-subheading mb-6'>
              Explore Our <span className='gold-gradient-text'>Curated Collection</span>
            </h2>
            <p className='text-luxury-body max-w-3xl mx-auto'>
              Experience cigars like never before with our interactive 3D explorer. Discover flavor
              profiles, origins, and perfect pairings through immersive visualization.
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div className='relative h-[600px] rounded-luxury-xl overflow-hidden bg-gradient-to-br from-background-secondary to-background-accent shadow-luxury-lg'>
              <CigarExplorer3D />
            </div>
          </Suspense>
        </div>
      </section>

      {/* AI-Powered Features */}
      <AIFeatures />

      {/* Premium Cigar Showcase */}
      <CigarShowcase />

      {/* Key Features */}
      <FeaturesSection />

      {/* Social Proof */}
      <TestimonialsSection />

      {/* Newsletter Signup */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </main>
  );
}
