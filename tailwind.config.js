/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury brand palette
        primary: {
          50: '#faf8f3',
          100: '#f4f1e8',
          200: '#ede7d3',
          300: '#d4af37',
          400: '#c69c6d',
          500: '#b8941f',
          600: '#a67856',
          700: '#8b6914',
          800: '#6b4f0a',
          900: '#4a3429',
          950: '#3c1810',
        },
        secondary: {
          50: '#faf8f3',
          100: '#f4f1e8',
          200: '#ede7d3',
          300: '#dab785',
          400: '#c69c6d',
          500: '#a67856',
          600: '#8b6914',
          700: '#6b4f0a',
          800: '#4a3429',
          900: '#3c1810',
          950: '#2a1b14',
        },
        luxury: {
          cream: '#f4f1e8',
          gold: '#d4af37',
          'gold-light': '#ffd700',
          'gold-dark': '#b8941f',
          mahogany: '#c04000',
          leather: '#4a3429',
          'deep-brown': '#3c1810',
          charcoal: '#1a0f0a',
          'warm-white': '#faf8f3',
        },
        background: {
          primary: '#1a0f0a',
          secondary: '#2a1b14',
          accent: '#3d2a1f',
          leather: '#4a3429',
        },
        text: {
          primary: '#f4f1e8',
          secondary: '#ede7d3',
          accent: '#d4af37',
          muted: '#a67856',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Source Serif Pro', 'serif'],
        accent: ['Crimson Text', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.7rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        luxury: '0.75rem',
        'luxury-lg': '1.25rem',
        'luxury-xl': '1.5rem',
      },
      boxShadow: {
        luxury: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'luxury-lg': '0 16px 64px rgba(0, 0, 0, 0.5)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 32px rgba(212, 175, 55, 0.4)',
        'inner-luxury': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #1a0f0a 0%, #2a1b14 35%, #3c1810 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
        'gradient-leather': 'linear-gradient(45deg, #4a3429 0%, #3c1810 100%)',
        'hero-pattern':
          'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      screens: {
        xs: '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.6)',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.luxury-gradient': {
          background: 'linear-gradient(135deg, #1a0f0a 0%, #2a1b14 35%, #3c1810 100%)',
        },
        '.gold-gradient-text': {
          background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #b8941f 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });
    },
  ],
};
