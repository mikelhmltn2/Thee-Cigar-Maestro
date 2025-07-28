/**
 * Thee Cigar Maestro API Server
 * Comprehensive backend for cigar enthusiast platform
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:8000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Thee Cigar Maestro API',
      version: '1.0.0',
      description: 'Comprehensive API for cigar enthusiasts',
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// In-memory storage (replace with database in production)
const users = new Map();
const cigars = new Map();
const reviews = new Map();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cigars: '/api/cigars',
      users: '/api/users',
      analytics: '/api/analytics'
    }
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    if (users.has(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      preferences: {},
      favorites: []
    };

    users.set(email, user);

    // Generate token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email, name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/cigars:
 *   get:
 *     summary: Get all cigars
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of cigars to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of cigars to skip
 *     responses:
 *       200:
 *         description: List of cigars
 */
app.get('/api/cigars', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Check cache first
    const cacheKey = `cigars:${limit}:${offset}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // In a real app, this would query a database
    // For now, we'll return sample data
    const sampleCigars = [
      {
        id: uuidv4(),
        name: "Romeo y Julieta Churchill",
        brand: "Romeo y Julieta",
        origin: "Cuba",
        strength: "Medium",
        size: "Churchill",
        length: 178,
        ringGauge: 47,
        wrapper: "Natural",
        notes: ["Cedar", "Leather", "Coffee"]
      },
      {
        id: uuidv4(),
        name: "Montecristo No. 2",
        brand: "Montecristo",
        origin: "Cuba",
        strength: "Medium to Full",
        size: "Torpedo",
        length: 156,
        ringGauge: 52,
        wrapper: "Natural",
        notes: ["Spice", "Wood", "Vanilla"]
      }
    ];

    const result = {
      cigars: sampleCigars.slice(parseInt(offset, 10), parseInt(offset, 10) + parseInt(limit, 10)),
      total: sampleCigars.length,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Cigars fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/cigars/search:
 *   post:
 *     summary: Search cigars
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               filters:
 *                 type: object
 *     responses:
 *       200:
 *         description: Search results
 */
app.post('/api/cigars/search', (req, res) => {
  try {
    const { query, filters = {} } = req.body;

    // Simple search implementation
    // In production, use elasticsearch or similar
    const searchResults = [
      {
        id: uuidv4(),
        name: "Cohiba Behike 52",
        brand: "Cohiba",
        origin: "Cuba",
        strength: "Full",
        relevanceScore: 0.95
      }
    ];

    res.json({
      query,
      filters,
      results: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      preferences: user.preferences,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     summary: Get user favorites
 *     description: Retrieve the current user's favorite cigars
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of favorite cigar names
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.get('/api/user/favorites', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      favorites: user.favorites || []
    });
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/favorites:
 *   post:
 *     summary: Add cigar to favorites
 *     description: Add a cigar to the current user's favorites list
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cigarName
 *             properties:
 *               cigarName:
 *                 type: string
 *                 description: Name of the cigar to add to favorites
 *     responses:
 *       200:
 *         description: Cigar added to favorites successfully
 *       400:
 *         description: Invalid request data or cigar already in favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.post('/api/user/favorites', authenticateToken, (req, res) => {
  try {
    const { cigarName } = req.body;
    
    if (!cigarName || typeof cigarName !== 'string') {
      return res.status(400).json({ error: 'Valid cigar name is required' });
    }

    const user = Array.from(users.values()).find(u => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    if (user.favorites.includes(cigarName)) {
      return res.status(400).json({ error: 'Cigar already in favorites' });
    }

    user.favorites.push(cigarName);
    users.set(user.email, user);

    res.json({
      message: 'Cigar added to favorites successfully',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/user/favorites/{cigarName}:
 *   delete:
 *     summary: Remove cigar from favorites
 *     description: Remove a cigar from the current user's favorites list
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cigarName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the cigar to remove from favorites
 *     responses:
 *       200:
 *         description: Cigar removed from favorites successfully
 *       400:
 *         description: Cigar not found in favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.delete('/api/user/favorites/:cigarName', authenticateToken, (req, res) => {
  try {
    const { cigarName } = req.params;
    
    if (!cigarName) {
      return res.status(400).json({ error: 'Cigar name is required' });
    }

    const user = Array.from(users.values()).find(u => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.favorites || !user.favorites.includes(cigarName)) {
      return res.status(400).json({ error: 'Cigar not found in favorites' });
    }

    user.favorites = user.favorites.filter(fav => fav !== cigarName);
    users.set(user.email, user);

    res.json({
      message: 'Cigar removed from favorites successfully',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Track analytics event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               properties:
 *                 type: object
 *     responses:
 *       200:
 *         description: Event tracked
 */
app.post('/api/analytics/track', (req, res) => {
  try {
    const { event, properties = {} } = req.body;

    // In production, send to analytics service
    console.info('Analytics event:', { event, properties, timestamp: new Date().toISOString() });

    res.json({
      message: 'Event tracked successfully',
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.info(`🚀 Thee Cigar Maestro API Server running on port ${PORT}`);
  console.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.info(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;