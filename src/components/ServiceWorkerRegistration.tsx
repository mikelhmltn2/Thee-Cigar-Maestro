'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration)
            
            // Check for updates periodically
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000) // Check every hour
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error)
          })
      })
    }

    // Initialize GA dataLayer without inline script for CSP compliance
    if (typeof window !== 'undefined' && !(window as any).dataLayer) {
      (window as any).dataLayer = []
      ;(window as any).gtag = function () { (window as any).dataLayer.push(arguments) }
      ;(window as any).gtag('js', new Date())
      ;(window as any).gtag('config', 'G-ZXVHGWYLKB')
    }
  }, [])

  return null
}