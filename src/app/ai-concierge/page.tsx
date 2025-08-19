import { Metadata } from 'next';
import AIConciergeInterface from './components/AIConciergeInterface';
import RecommendationEngine from './components/RecommendationEngine';
import PersonalityQuiz from './components/PersonalityQuiz';
import { AnimatedReveal, GoldGradientText, LuxuryCard } from '@/components/luxury';
import { Sparkles, Brain, MessageSquare, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Concierge - Personalized Cigar Recommendations | Thee Cigar Maestro',
  description:
    'Get expert cigar recommendations tailored to your preferences with our AI-powered sommelier. Available 24/7 for instant guidance.',
  keywords: [
    'AI cigar recommendations',
    'cigar sommelier',
    'personalized cigars',
    'cigar chatbot',
    'luxury cigars',
  ],
};

export default function AIConcierge() {
  return (
    <div className='min-h-screen pt-20 bg-gradient-to-br from-background-primary via-background-secondary to-background-accent'>
      {/* Hero Section */}
      <section className='section-luxury relative overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-20 left-10 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl animate-pulse' />
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl animate-pulse delay-1000' />
        </div>

        <div className='container-luxury text-center relative z-10'>
          <AnimatedReveal>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 rounded-full mb-8'>
              <Brain className='w-4 h-4 text-luxury-gold' />
              <span className='text-sm text-luxury-gold font-medium'>Powered by Advanced AI</span>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <h1 className='text-luxury-heading mb-6'>
              Your Personal <GoldGradientText variant='premium'>AI Sommelier</GoldGradientText>
            </h1>
          </AnimatedReveal>

          <AnimatedReveal delay={0.2}>
            <p className='text-luxury-body max-w-3xl mx-auto mb-12'>
              Experience the future of cigar curation with our advanced AI that learns your
              preferences, understands your mood, and recommends the perfect cigar for any occasion.
              Available 24/7 with the knowledge of master blenders and tobacco experts.
            </p>
          </AnimatedReveal>

          {/* Feature highlights */}
          <AnimatedReveal delay={0.3}>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              {[
                {
                  icon: MessageSquare,
                  title: 'Natural Conversations',
                  desc: 'Chat naturally about your preferences',
                },
                {
                  icon: Target,
                  title: 'Precision Matching',
                  desc: '99.9% recommendation accuracy',
                },
                {
                  icon: Sparkles,
                  title: 'Evolving Intelligence',
                  desc: 'Learns and improves with every interaction',
                },
              ].map((feature, index) => (
                <LuxuryCard key={index} variant='glass' className='p-6 text-center'>
                  <feature.icon className='w-8 h-8 text-luxury-gold mx-auto mb-3' />
                  <h3 className='text-lg font-medium text-text-primary mb-2'>{feature.title}</h3>
                  <p className='text-sm text-text-muted'>{feature.desc}</p>
                </LuxuryCard>
              ))}
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* Main Interface */}
      <section className='pb-20'>
        <div className='container-luxury'>
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* AI Chat Interface */}
            <AnimatedReveal direction='left'>
              <div className='space-y-8'>
                <div className='text-center lg:text-left'>
                  <h2 className='text-luxury-subheading mb-4'>
                    Chat with Your <GoldGradientText>AI Concierge</GoldGradientText>
                  </h2>
                  <p className='text-luxury-body'>
                    Ask questions, get recommendations, or learn about cigar culture. Our AI
                    understands context and provides expert-level guidance.
                  </p>
                </div>
                <LuxuryCard variant='premium' className='p-0 overflow-hidden'>
                  <AIConciergeInterface />
                </LuxuryCard>
              </div>
            </AnimatedReveal>

            {/* Recommendation Engine */}
            <AnimatedReveal direction='right'>
              <div className='space-y-8'>
                <div className='text-center lg:text-left'>
                  <h2 className='text-luxury-subheading mb-4'>
                    Smart <GoldGradientText>Recommendations</GoldGradientText>
                  </h2>
                  <p className='text-luxury-body'>
                    Get instant cigar suggestions based on your preferences, mood, and the occasion.
                    Our AI considers hundreds of factors for perfect matching.
                  </p>
                </div>
                <LuxuryCard variant='premium' className='p-0 overflow-hidden'>
                  <RecommendationEngine />
                </LuxuryCard>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Personality Assessment */}
      <section className='section-luxury bg-gradient-to-br from-background-secondary to-background-accent relative overflow-hidden'>
        {/* Pattern overlay */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='h-full w-full'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className='container-luxury relative z-10'>
          <AnimatedReveal>
            <div className='text-center mb-12'>
              <h2 className='text-luxury-subheading mb-6'>
                Discover Your{' '}
                <GoldGradientText variant='premium'>Cigar Personality</GoldGradientText>
              </h2>
              <p className='text-luxury-body max-w-2xl mx-auto'>
                Take our comprehensive assessment to help our AI understand your preferences better.
                Based on your answers, we'll create a personalized flavor profile and smoking style.
              </p>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.2}>
            <LuxuryCard variant='glass' className='max-w-4xl mx-auto'>
              <PersonalityQuiz />
            </LuxuryCard>
          </AnimatedReveal>
        </div>
      </section>
    </div>
  );
}
