import { Metadata } from 'next'
import AIConciergeInterface from './components/AIConciergeInterface'
import RecommendationEngine from './components/RecommendationEngine'
import PersonalityQuiz from './components/PersonalityQuiz'

export const metadata: Metadata = {
  title: 'AI Concierge - Personalized Cigar Recommendations',
  description: 'Get expert cigar recommendations tailored to your preferences with our AI-powered sommelier. Available 24/7 for instant guidance.',
  keywords: ['AI cigar recommendations', 'cigar sommelier', 'personalized cigars', 'cigar chatbot'],
}

export default function AIConcierge() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-luxury">
      {/* Hero Section */}
      <section className="section-luxury">
        <div className="container-luxury text-center">
          <h1 className="text-luxury-heading mb-6">
            Your Personal <span className="gold-gradient-text">AI Sommelier</span>
          </h1>
          <p className="text-luxury-body max-w-3xl mx-auto mb-12">
            Experience the future of cigar curation with our advanced AI that learns your preferences, 
            understands your mood, and recommends the perfect cigar for any occasion. Available 24/7 
            with the knowledge of master blenders and tobacco experts.
          </p>
        </div>
      </section>

      {/* Main Interface */}
      <section className="pb-20">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* AI Chat Interface */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-luxury-subheading mb-4">
                  Chat with Your <span className="gold-gradient-text">AI Concierge</span>
                </h2>
                <p className="text-luxury-body">
                  Ask questions, get recommendations, or learn about cigar culture. 
                  Our AI understands context and provides expert-level guidance.
                </p>
              </div>
              <AIConciergeInterface />
            </div>

            {/* Recommendation Engine */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-luxury-subheading mb-4">
                  Smart <span className="gold-gradient-text">Recommendations</span>
                </h2>
                <p className="text-luxury-body">
                  Get instant cigar suggestions based on your preferences, mood, 
                  and the occasion. Our AI considers hundreds of factors for perfect matching.
                </p>
              </div>
              <RecommendationEngine />
            </div>
          </div>
        </div>
      </section>

      {/* Personality Assessment */}
      <section className="section-luxury bg-background-secondary">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="text-luxury-subheading mb-6">
              Discover Your <span className="gold-gradient-text">Cigar Personality</span>
            </h2>
            <p className="text-luxury-body max-w-2xl mx-auto">
              Take our comprehensive assessment to help our AI understand your preferences better. 
              Based on your answers, we'll create a personalized flavor profile and smoking style.
            </p>
          </div>
          <PersonalityQuiz />
        </div>
      </section>
    </div>
  )
}