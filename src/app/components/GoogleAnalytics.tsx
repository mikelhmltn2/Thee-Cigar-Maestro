'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-ZXVHGWYLKB', {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}

// Utility functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters,
    })
  }
}

export const trackCigarRecommendation = (cigarName: string, source: string) => {
  trackEvent('cigar_recommendation_viewed', {
    event_category: 'ai_interaction',
    cigar_name: cigarName,
    recommendation_source: source,
  })
}

export const trackVirtualHumidorAction = (action: string, cigarCount?: number) => {
  trackEvent('virtual_humidor_action', {
    event_category: 'collection_management',
    action_type: action,
    cigar_count: cigarCount || 0,
  })
}

export const trackChatbotInteraction = (messageType: string, userIntent?: string) => {
  trackEvent('chatbot_interaction', {
    event_category: 'ai_concierge',
    message_type: messageType,
    user_intent: userIntent || 'unknown',
  })
}

export const trackEcommercePurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items,
    })
  }
}

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-ZXVHGWYLKB', {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}