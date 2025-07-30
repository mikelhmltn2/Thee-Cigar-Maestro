'use client'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-luxury-gold/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-luxury-gold rounded-full animate-pulse"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 w-8 h-8 border-2 border-luxury-gold-light/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="absolute top-0 left-0 w-2 h-2 bg-luxury-gold-light rounded-full"></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-6 w-4 h-4 bg-gradient-gold rounded-full animate-pulse"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 w-16 h-16 bg-luxury-gold/10 rounded-full blur-lg animate-glow"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner