# 🚀 Thee Cigar Maestro - Deployment Guide

## Quick Deployment Options

### 1. Netlify (Recommended for Frontend)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

### 2. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. GitHub Pages
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Site will be available at: https://yourusername.github.io/thee-cigar-maestro

### 4. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

### 5. AWS S3 + CloudFront
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Sync to S3
aws s3 sync . s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 6. Docker Deployment
```bash
# Build Docker image
docker build -t thee-cigar-maestro .

# Run container
docker run -p 80:80 thee-cigar-maestro
```

## Backend Deployment (Optional)

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku app
heroku create thee-cigar-maestro-api

# Deploy backend
cd backend-api
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway deploy
```

### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://api.theecigarmaestro.com
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
```

### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cigar-maestro
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Performance Optimizations

### CDN Setup
- Use CloudFlare for global CDN
- Enable Brotli compression
- Set up proper cache headers

### Monitoring
- Google Analytics 4 (configured)
- Core Web Vitals monitoring (configured)
- Error tracking with Sentry

### Security
- HTTPS enabled (required for PWA)
- Security headers configured
- Content Security Policy
- Rate limiting on API endpoints

## Custom Domain Setup

### Netlify
1. Add custom domain in Netlify dashboard
2. Configure DNS records
3. Enable HTTPS

### Vercel
1. Add domain in Vercel dashboard
2. Configure DNS records
3. Automatic HTTPS

### Cloudflare
1. Add site to Cloudflare
2. Update nameservers
3. Configure SSL/TLS

## SSL Certificate
- Let's Encrypt (automatic with most platforms)
- CloudFlare SSL (free tier available)
- Custom certificate upload

## Backup Strategy
- Database backups (MongoDB Atlas automatic)
- Code repository (GitHub)
- Static assets (cloud storage)

## Monitoring URLs
- Frontend: https://theecigarmaestro.com
- API: https://api.theecigarmaestro.com/health
- Analytics: Google Analytics dashboard
- Performance: Web Vitals reports

## Support
For deployment issues, contact: support@theecigarmaestro.com
