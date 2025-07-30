import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, Crimson_Text } from 'next/font/google'
import { GoogleAnalytics } from './components/GoogleAnalytics'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  display: 'swap',
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Thee Cigar Maestro — The Art. The Ritual. The Maestro.',
    template: '%s | Thee Cigar Maestro'
  },
  description: 'Experience the pinnacle of cigar culture with AI-driven recommendations, luxury curation, and immersive digital experiences. From novice to connoisseur, discover your perfect cigar journey.',
  keywords: [
    'premium cigars',
    'cigar recommendations',
    'luxury cigars',
    'AI cigar advisor',
    'cigar collection',
    'Cuban cigars',
    'cigar accessories',
    'cigar humidor',
    'tobacco culture',
    'cigar sommelier'
  ],
  authors: [{ name: 'Mike Hamilton' }],
  creator: 'Mike Hamilton',
  publisher: 'Thee Cigar Maestro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://theecigarmaestro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theecigarmaestro.com',
    title: 'Thee Cigar Maestro — The Art. The Ritual. The Maestro.',
    description: 'Experience the pinnacle of cigar culture with AI-driven recommendations and luxury curation.',
    siteName: 'Thee Cigar Maestro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Thee Cigar Maestro - Premium Cigar Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thee Cigar Maestro — The Art. The Ritual. The Maestro.',
    description: 'Experience the pinnacle of cigar culture with AI-driven recommendations and luxury curation.',
    images: ['/og-image.jpg'],
    creator: '@theecigarmaestro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${playfairDisplay.variable} ${sourceSerif4.variable} ${crimsonText.variable}`}
    >
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZXVHGWYLKB"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZXVHGWYLKB');
            `,
          }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme and PWA */}
        <meta name="theme-color" content="#1a0f0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="luxury-gradient font-body text-text-primary antialiased">
        <GoogleAnalytics />
        <div className="relative min-h-screen">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2a1b14',
              color: '#f4f1e8',
              border: '1px solid #d4af37',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#f4f1e8',
              },
            },
          }}
        />
      </body>
    </html>
  )
}