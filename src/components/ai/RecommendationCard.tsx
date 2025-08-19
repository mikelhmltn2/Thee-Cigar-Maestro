'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, DollarSign, Clock, Flame, Globe } from 'lucide-react';
import { LuxuryCard, GoldGradientText, LuxuryButton } from '@/components/luxury';
import { cn } from '@/utils/cn';
import type { Recommendation } from '@/lib/ai/recommendation-engine';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  onSelect?: (recommendation: Recommendation) => void;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  onSelect,
  className,
}) => {
  const { cigar, matchPercentage, reasoning, aiInsights } = recommendation;

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'mild':
        return <Flame className='w-4 h-4 text-yellow-500' />;
      case 'medium':
        return <Flame className='w-4 h-4 text-orange-500' />;
      case 'full':
        return <Flame className='w-4 h-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getPremiumBadge = (level: string) => {
    switch (level) {
      case 'exclusive':
        return (
          <div className='absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium'>
            Exclusive
          </div>
        );
      case 'ultra-premium':
        return (
          <div className='absolute top-4 right-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-background-primary px-3 py-1 rounded-full text-xs font-medium'>
            Ultra Premium
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(className)}
    >
      <LuxuryCard variant='premium' className='relative overflow-hidden'>
        {/* Match percentage indicator */}
        <div className='absolute top-0 left-0 w-full h-1 bg-background-accent'>
          <motion.div
            className='h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light'
            initial={{ width: 0 }}
            animate={{ width: `${matchPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Premium badge */}
        {getPremiumBadge(cigar.premiumLevel)}

        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-xl font-display text-text-primary mb-1'>{cigar.name}</h3>
              <p className='text-sm text-luxury-gold'>{cigar.brand}</p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold'>
                <GoldGradientText>{matchPercentage}%</GoldGradientText>
              </div>
              <p className='text-xs text-text-muted'>Match</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className='grid grid-cols-4 gap-3 mb-4'>
            <div className='text-center'>
              <div className='flex items-center justify-center mb-1'>
                {getStrengthIcon(cigar.strength)}
              </div>
              <p className='text-xs text-text-muted capitalize'>{cigar.strength}</p>
            </div>
            <div className='text-center'>
              <div className='flex items-center justify-center mb-1'>
                <Globe className='w-4 h-4 text-luxury-gold' />
              </div>
              <p className='text-xs text-text-muted'>{cigar.origin}</p>
            </div>
            <div className='text-center'>
              <div className='flex items-center justify-center mb-1'>
                <Star className='w-4 h-4 text-luxury-gold' />
              </div>
              <p className='text-xs text-text-muted'>{cigar.rating}/5</p>
            </div>
            <div className='text-center'>
              <div className='flex items-center justify-center mb-1'>
                <DollarSign className='w-4 h-4 text-luxury-gold' />
              </div>
              <p className='text-xs text-text-muted'>${cigar.price}</p>
            </div>
          </div>

          {/* Flavor profile */}
          <div className='mb-4'>
            <p className='text-xs text-text-muted mb-2'>Flavor Profile</p>
            <div className='flex flex-wrap gap-2'>
              {cigar.flavorProfile.slice(0, 4).map(flavor => (
                <span
                  key={flavor}
                  className='px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-xs'
                >
                  {flavor}
                </span>
              ))}
              {cigar.flavorProfile.length > 4 && (
                <span className='px-2 py-1 text-text-muted text-xs'>
                  +{cigar.flavorProfile.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className='mb-4 p-3 bg-background-accent rounded-luxury border border-luxury-gold/10'>
            <p className='text-sm text-text-secondary italic'>"{aiInsights}"</p>
          </div>

          {/* Reasoning */}
          <div className='mb-4'>
            <p className='text-xs text-text-muted mb-2'>Why we recommend this</p>
            <ul className='space-y-1'>
              {reasoning.slice(0, 3).map((reason, idx) => (
                <li key={idx} className='text-xs text-text-secondary flex items-start gap-2'>
                  <span className='text-luxury-gold mt-0.5'>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <LuxuryButton
              variant='primary'
              size='sm'
              onClick={() => onSelect?.(recommendation)}
              className='flex-1'
            >
              View Details
            </LuxuryButton>
            <LuxuryButton variant='secondary' size='sm' className='flex-1'>
              Add to Humidor
            </LuxuryButton>
          </div>

          {/* Alternatives preview */}
          {recommendation.alternatives && recommendation.alternatives.length > 0 && (
            <div className='mt-4 pt-4 border-t border-luxury-gold/10'>
              <p className='text-xs text-text-muted mb-2'>Similar options</p>
              <div className='flex gap-2'>
                {recommendation.alternatives.slice(0, 3).map(alt => (
                  <div
                    key={alt.id}
                    className='flex-1 text-center p-2 bg-background-accent rounded-luxury'
                  >
                    <p className='text-xs text-text-primary truncate'>{alt.name}</p>
                    <p className='text-xs text-luxury-gold'>${alt.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </LuxuryCard>
    </motion.div>
  );
};

export default RecommendationCard;
