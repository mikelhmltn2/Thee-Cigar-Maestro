'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Heart, ShoppingCart, Filter, RefreshCw } from 'lucide-react';
import { trackCigarRecommendation } from '../../components/GoogleAnalytics';

interface RecommendationFilters {
  mood: string;
  occasion: string;
  strength: string;
  priceRange: string;
  experience: string;
}

interface Recommendation {
  id: number;
  name: string;
  brand: string;
  origin: string;
  strength: string;
  wrapper: string;
  price: number;
  rating: number;
  confidence: number;
  description: string;
  flavorNotes: string[];
  pairsWith: string[];
  image: string;
}

const RecommendationEngine = () => {
  const [filters, setFilters] = useState<RecommendationFilters>({
    mood: '',
    occasion: '',
    strength: '',
    priceRange: '',
    experience: '',
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterOptions = {
    mood: [
      { value: 'relaxed', label: 'Relaxed & Contemplative' },
      { value: 'celebratory', label: 'Celebratory & Joyful' },
      { value: 'focused', label: 'Focused & Productive' },
      { value: 'social', label: 'Social & Engaging' },
      { value: 'adventurous', label: 'Adventurous & Bold' },
    ],
    occasion: [
      { value: 'evening', label: 'Evening Relaxation' },
      { value: 'celebration', label: 'Special Celebration' },
      { value: 'business', label: 'Business Meeting' },
      { value: 'weekend', label: 'Weekend Leisure' },
      { value: 'pairing', label: 'Food/Drink Pairing' },
    ],
    strength: [
      { value: 'mild', label: 'Mild (Beginner Friendly)' },
      { value: 'medium-mild', label: 'Medium-Mild' },
      { value: 'medium', label: 'Medium' },
      { value: 'medium-full', label: 'Medium-Full' },
      { value: 'full', label: 'Full (Expert Level)' },
    ],
    priceRange: [
      { value: 'budget', label: 'Budget ($10-20)' },
      { value: 'moderate', label: 'Moderate ($20-35)' },
      { value: 'premium', label: 'Premium ($35-50)' },
      { value: 'luxury', label: 'Luxury ($50+)' },
    ],
    experience: [
      { value: 'beginner', label: 'New to Cigars' },
      { value: 'intermediate', label: 'Some Experience' },
      { value: 'advanced', label: 'Experienced Smoker' },
      { value: 'expert', label: 'Connoisseur' },
    ],
  };

  const generateRecommendations = async () => {
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock recommendations based on filters
    const mockRecommendations: Recommendation[] = [
      {
        id: 1,
        name: 'Cohiba Behike 56',
        brand: 'Cohiba',
        origin: 'Cuba',
        strength: 'Full',
        wrapper: 'Medio Tiempo',
        price: 45,
        rating: 4.9,
        confidence: 95,
        description: 'The pinnacle of Cuban cigar making with rare Medio Tiempo leaves',
        flavorNotes: ['Dark chocolate', 'Cedar', 'Coffee', 'Spice'],
        pairsWith: ['Aged rum', 'Single malt whiskey', 'Port wine'],
        image: '/cigars/cohiba-behike.jpg',
      },
      {
        id: 2,
        name: 'Arturo Fuente Opus X',
        brand: 'Arturo Fuente',
        origin: 'Dominican Republic',
        strength: 'Medium-Full',
        wrapper: 'Rosado',
        price: 35,
        rating: 4.8,
        confidence: 88,
        description: 'Legendary cigar grown in volcanic soil with perfect construction',
        flavorNotes: ['Spicy cedar', 'Leather', 'Pepper', 'Earth'],
        pairsWith: ['Cognac', 'Dark coffee', 'Red wine'],
        image: '/cigars/opus-x.jpg',
      },
      {
        id: 3,
        name: 'Padron 1964 Anniversary',
        brand: 'Padron',
        origin: 'Nicaragua',
        strength: 'Medium',
        wrapper: 'Natural',
        price: 28,
        rating: 4.7,
        confidence: 92,
        description: 'Celebrating 30 years of excellence with aged tobacco',
        flavorNotes: ['Creamy nuts', 'Vanilla', 'Chocolate', 'Toast'],
        pairsWith: ['Bourbon', 'Espresso', 'Cream sherry'],
        image: '/cigars/padron-1964.jpg',
      },
    ];

    setRecommendations(mockRecommendations);
    setIsLoading(false);

    // Track recommendation generation
    trackCigarRecommendation('bulk_recommendations', 'recommendation_engine');
  };

  const handleFilterChange = (category: keyof RecommendationFilters, value: string) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className='space-y-6'>
      {/* Filter Interface */}
      <div className='card-luxury p-6'>
        <div className='flex items-center space-x-2 mb-6'>
          <Filter className='w-5 h-5 text-luxury-gold' />
          <h3 className='font-display text-lg font-semibold text-luxury-gold'>
            Preference Filters
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category}>
              <label className='block text-sm font-medium text-text-accent mb-2 capitalize'>
                {category === 'priceRange' ? 'Price Range' : category}
              </label>
              <select
                value={filters[category as keyof RecommendationFilters]}
                onChange={e =>
                  handleFilterChange(category as keyof RecommendationFilters, e.target.value)
                }
                className='input-luxury w-full'
              >
                <option value=''>Select {category}</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={generateRecommendations}
          disabled={isLoading || Object.values(filters).every(v => !v)}
          className='btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              <RefreshCw className='w-5 h-5 animate-spin' />
              <span>Analyzing Preferences...</span>
            </div>
          ) : (
            <div className='flex items-center justify-center space-x-2'>
              <Zap className='w-5 h-5' />
              <span>Get AI Recommendations</span>
            </div>
          )}
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='space-y-4'
        >
          <h3 className='font-display text-xl font-semibold text-luxury-gold'>
            Perfect Matches for You
          </h3>

          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className='card-glass p-6 group hover:shadow-gold transition-all duration-300'
            >
              <div className='flex flex-col lg:flex-row gap-6'>
                {/* Cigar Image Placeholder */}
                <div className='w-full lg:w-32 h-32 bg-gradient-to-br from-luxury-leather to-luxury-deep-brown rounded-luxury flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='w-16 h-4 bg-luxury-gold rounded-full mx-auto mb-2 opacity-80' />
                    <div className='w-12 h-2 bg-luxury-gold-dark rounded-full mx-auto opacity-60' />
                  </div>
                </div>

                {/* Content */}
                <div className='flex-1 space-y-4'>
                  {/* Header */}
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-display text-xl font-semibold text-luxury-gold group-hover:text-luxury-gold-light transition-colors'>
                        {rec.name}
                      </h4>
                      <p className='text-text-muted'>
                        {rec.brand} • {rec.origin}
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-luxury-gold'>${rec.price}</div>
                      <div className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-luxury-gold fill-current' />
                        <span className='text-sm text-text-muted'>{rec.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-text-muted'>AI Confidence:</span>
                    <div className='flex-1 bg-background-accent rounded-full h-2'>
                      <div
                        className='bg-gradient-gold h-2 rounded-full transition-all duration-300'
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className='text-sm font-medium text-luxury-gold'>{rec.confidence}%</span>
                  </div>

                  {/* Description */}
                  <p className='text-text-secondary'>{rec.description}</p>

                  {/* Details Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Flavor Notes */}
                    <div>
                      <h5 className='text-sm font-medium text-text-accent mb-2'>Flavor Notes</h5>
                      <div className='flex flex-wrap gap-1'>
                        {rec.flavorNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className='text-xs bg-background-accent text-text-secondary px-2 py-1 rounded-luxury'
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Specs */}
                    <div>
                      <h5 className='text-sm font-medium text-text-accent mb-2'>Specifications</h5>
                      <div className='space-y-1 text-sm text-text-secondary'>
                        <div>Strength: {rec.strength}</div>
                        <div>Wrapper: {rec.wrapper}</div>
                      </div>
                    </div>

                    {/* Pairings */}
                    <div>
                      <h5 className='text-sm font-medium text-text-accent mb-2'>Pairs With</h5>
                      <div className='space-y-1 text-sm text-text-secondary'>
                        {rec.pairsWith.slice(0, 2).map((pairing, idx) => (
                          <div key={idx}>• {pairing}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex space-x-3 pt-4 border-t border-text-muted/20'>
                    <button className='btn-primary flex-1'>
                      <ShoppingCart className='w-4 h-4 mr-2' />
                      Add to Cart
                    </button>
                    <button className='btn-secondary'>
                      <Heart className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecommendationEngine;
