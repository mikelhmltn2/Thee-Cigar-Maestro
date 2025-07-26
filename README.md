# Thee Cigar Maestro 🚬

A sophisticated web application for cigar enthusiasts featuring interactive 3D visualization, educational content, and AI-powered recommendations.

## 🌟 Features

- **Flavorverse**: Interactive 3D visualization of cigar data using Three.js
- **AI Assistant**: GPT-powered chat for cigar recommendations and pairings
- **Educational Content**: Structured learning materials with CEU support
- **Voice Recording**: Capture ritual memories with audio recording
- **Responsive Design**: Works on desktop and mobile devices
- **Security Hardened**: XSS protection, CSP headers, input validation

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thee-cigar-maestro
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using any static file server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
thee-cigar-maestro/
├── index.html                              # Main application
├── flavorverse_ritual_trail_interface.html # Alternative interface
├── gpt.js                                  # AI chat integration
├── style.css                              # Optimized styles
├── flavorverse_nodes.json                 # Cigar data
├── cigar-specs.json                       # Detailed specifications
├── pairings.json                          # Pairing recommendations
├── education.json                         # Educational content
├── features.json                          # Feature specifications
├── interface.json                         # UI configuration
├── meta.json                              # Metadata and prompts
├── *.html                                 # Additional pages
└── LICENSE                                # MIT License
```

## 🔒 Security Features

### Implemented Protections
- **XSS Prevention**: All user inputs sanitized, `innerHTML` replaced with `textContent`
- **Content Security Policy**: Restricts resource loading to trusted sources
- **Input Validation**: Length limits and sanitization for all user inputs
- **HTTPS Only**: External resources loaded over secure connections
- **Error Handling**: Comprehensive error handling prevents information disclosure
- **Timeout Protection**: Request timeouts prevent hanging connections

### Security Headers
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  media-src 'self' blob:; 
  connect-src 'self' https://theecigarmaestro.vercel.app;
" />
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `#121212`
- **Secondary Background**: `#1c1c1c`
- **Accent Background**: `#2c2c2c`
- **Primary Text**: `#f0e6d2`
- **Accent Text**: `#c69c6d`
- **Secondary Text**: `#a67856`
- **Link Text**: `#dab785`

### Typography
- **Font Family**: Georgia, serif
- **Consistent spacing**: CSS custom properties
- **Responsive scaling**: Viewport-based sizing

## 🛠️ Dependencies

### External Libraries
- **Three.js v0.160.0**: 3D visualization and WebGL rendering
- **OrbitControls**: Camera controls for 3D scene navigation

### Browser APIs
- **WebGL**: 3D graphics rendering
- **MediaRecorder**: Audio recording functionality
- **Fetch API**: Network requests with timeout support
- **Web Audio API**: Audio playback and processing

## 📊 Data Structure

### Cigar Data Format
```json
{
  "name": "Cigar Name",
  "flavor": "Detailed flavor profile description",
  "wrapper": "Wrapper type (Maduro, Connecticut, Habano, etc.)",
  "color": 16777215
}
```

### Wrapper Types
- **Maduro**: Dark, sweet wrapper with chocolate notes
- **Connecticut**: Light, mild wrapper with creamy flavor
- **Habano**: Medium-bodied with spice and complexity
- **Natural**: Balanced wrapper with nutty characteristics
- **Oscuro**: Very dark wrapper with bold, earthy flavors

## 🔧 Configuration

### Environment Setup
No build process required - pure client-side application.

### API Configuration
Update the GPT API endpoint in `gpt.js`:
```javascript
const res = await fetch("https://your-api-endpoint.com/api/gpt", {
  // configuration
});
```

## 📱 Browser Support

### Minimum Requirements
- **Chrome**: 58+
- **Firefox**: 55+
- **Safari**: 11+
- **Edge**: 79+

### Required Features
- ES6+ JavaScript support
- WebGL support
- CSS Grid and Flexbox
- Fetch API
- MediaRecorder API (for voice features)

## 🚨 Known Issues & Limitations

1. **Large Image Files**: Logo.png is 446KB - consider optimization
2. **No Offline Support**: Requires internet connection for 3D libraries
3. **Memory Usage**: Large 3D scenes may impact performance on low-end devices
4. **Audio Codec**: WebM format may not be supported on all browsers

## 🔄 Performance Optimization

### Implemented Optimizations
- **Efficient Rendering**: Damped camera controls reduce unnecessary redraws
- **Lazy Loading**: Error handling prevents failed resources from blocking UI
- **CSS Animations**: Hardware-accelerated transitions
- **Responsive Images**: CSS background patterns instead of external images
- **Minified Dependencies**: CDN-hosted, compressed libraries

### Recommendations
1. Implement image optimization for logo.png
2. Add service worker for offline functionality
3. Consider WebP format for better compression
4. Implement virtual scrolling for large datasets

## 🧪 Testing

### Manual Testing Checklist
- [ ] 3D scene loads and renders correctly
- [ ] All cigar data displays with proper formatting
- [ ] GPT chat interface accepts input and shows responses
- [ ] Voice recording works in supported browsers
- [ ] Responsive design works on mobile devices
- [ ] All external links are secure (HTTPS)
- [ ] Error handling displays appropriate messages

### Security Testing
- [ ] XSS injection attempts are blocked
- [ ] CSP headers prevent unauthorized resource loading
- [ ] Input validation prevents malformed data
- [ ] No sensitive information exposed in error messages

## 📖 Educational Content

The application includes structured educational materials for cigar enthusiasts:

### Learning Objectives
- Wrapper-to-spirit pairing logic
- Flavor profile identification
- Construction techniques
- Regional characteristics
- Aging and storage methods

### CEU Compliance
Educational content is structured for Continuing Education Unit requirements with:
- Clear learning objectives
- Assessment questions
- Progress tracking
- Certification pathways

## 🤝 Contributing

### Development Guidelines
1. **Security First**: All user inputs must be sanitized
2. **Accessibility**: Follow WCAG 2.1 guidelines
3. **Performance**: Test on low-end devices
4. **Cross-browser**: Verify compatibility across supported browsers
5. **Data Quality**: Validate all JSON data structures

### Code Style
- Use semantic HTML5 elements
- Follow CSS BEM methodology where applicable
- Prefer `const`/`let` over `var`
- Use meaningful variable names
- Document complex functions

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Mike Hamilton

## 🆘 Support

For technical issues:
1. Check browser console for error messages
2. Verify WebGL support: visit https://get.webgl.org/
3. Test with different browsers
4. Clear cache and hard refresh

For feature requests or bugs, please create an issue with:
- Browser version and OS
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (if any)

## 🗺️ Roadmap

### Phase 1: Core Stability
- [x] Security hardening
- [x] Performance optimization
- [x] Data quality improvements
- [x] Error handling enhancement

### Phase 2: Enhanced Features
- [ ] Backend API development
- [ ] User authentication system
- [ ] Personal cigar journals
- [ ] Advanced pairing algorithms

### Phase 3: Community Features
- [ ] User reviews and ratings
- [ ] Social sharing capabilities
- [ ] Retailer integration
- [ ] Mobile app development

---

**Built with ❤️ for cigar enthusiasts worldwide**