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
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
// MongoDB and Redis temporarily disabled
// const mongoose = require('mongoose');
// const Redis = require('ioredis');
const passport = require('passport');
// Winston logger temporarily disabled
// const winston = require('winston');
const expressWinston = require('express-winston');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cigarRoutes = require('./routes/cigars');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');
const recommendationRoutes = require('./routes/recommendations');
const socialRoutes = require('./routes/social');
const adminRoutes = require('./routes/admin');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
// Validation middleware temporarily disabled
// const validation = require('./middleware/validation');

// Import services
const DatabaseService = require('./services/DatabaseService');
const CacheService = require('./services/CacheService');
const EmailService = require('./services/EmailService');
const RecommendationEngine = require('./services/RecommendationEngine');
const AnalyticsService = require('./services/AnalyticsService');

// Import utilities
const logger = require('./utils/logger');
// Config temporarily disabled
// const config = require('./config/config');

class CigarMaestroServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8000",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 3000;
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Initialize services
    this.dbService = new DatabaseService();
    this.cacheService = new CacheService();
    this.emailService = new EmailService();
    this.recommendationEngine = new RecommendationEngine();
    this.analyticsService = new AnalyticsService();
    
    this.init();
  }

  /**
   * Initialize the server
   */
  async init() {
    try {
      await this.setupDatabase();
      await this.setupCache();
      await this.setupMiddleware();
      await this.setupPassport();
      await this.setupRoutes();
      await this.setupWebSocket();
      await this.setupCronJobs();
      await this.setupErrorHandling();
      
      this.start();
      
    } catch (_error) {
      logger.error('Failed to initialize server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup database connection
   */
  async setupDatabase() {
    try {
      await this.dbService.connect();
      logger.info('✅ Database connected successfully');
    } catch (_error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Setup Redis cache
   */
  async setupCache() {
    try {
      await this.cacheService.connect();
      logger.info('✅ Cache service connected successfully');
    } catch (_error) {
      logger.error('❌ Cache connection failed:', error);
      throw error;
    }
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.theecigarmaestro.com"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:8000',
          'https://theecigarmaestro.vercel.app',
          'https://api.theecigarmaestro.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: this.isProduction ? 100 : 1000, // requests per window
      message: {
        error: 'Too many requests, please try again later',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      store: new rateLimit.MemoryStore()
    });

    const speedLimiter = slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: this.isProduction ? 50 : 500,
      delayMs: 500
    });

    this.app.use('/api/', limiter);
    this.app.use('/api/', speedLimiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Request logging
    if (this.isProduction) {
      this.app.use(morgan('combined'));
    } else {
      this.app.use(morgan('dev'));
    }

    // Winston logging
    this.app.use(expressWinston.logger({
      winstonInstance: logger,
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorize: false,
      ignoredRoutes: ['/health', '/metrics']
    }));

    // Session configuration
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'cigar-maestro-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/cigar-maestro'
      }),
      cookie: {
        secure: this.isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Passport initialization
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    logger.info('✅ Middleware setup complete');
  }

  /**
   * Setup Passport authentication strategies
   */
  setupPassport() {
    require('./config/passport')(passport);
    logger.info('✅ Passport authentication configured');
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API documentation
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Thee Cigar Maestro API',
          version: '1.0.0',
          description: 'Comprehensive API for cigar enthusiasts',
          contact: {
            name: 'Mike Hamilton',
            email: 'support@theecigarmaestro.com'
          }
        },
        servers: [
          {
            url: process.env.API_URL || 'http://localhost:3000',
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      },
      apis: ['./routes/*.js']
    };

    const specs = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', authMiddleware.authenticate, userRoutes);
    this.app.use('/api/cigars', cigarRoutes);
    this.app.use('/api/search', searchRoutes);
    this.app.use('/api/analytics', authMiddleware.authenticate, analyticsRoutes);
    this.app.use('/api/recommendations', authMiddleware.authenticate, recommendationRoutes);
    this.app.use('/api/social', authMiddleware.authenticate, socialRoutes);
    this.app.use('/api/admin', authMiddleware.authenticate, authMiddleware.requireAdmin, adminRoutes);

    // Static file serving for uploads
    this.app.use('/uploads', express.static('uploads'));

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Thee Cigar Maestro API',
        version: '1.0.0',
        documentation: '/api-docs',
        health: '/health',
        status: 'operational'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
        timestamp: new Date().toISOString()
      });
    });

    logger.info('✅ Routes setup complete');
  }

  /**
   * Setup WebSocket connections
   */
  setupWebSocket() {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Join user to their personal room
      socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
        socket.userId = userId;
      });

      // Handle real-time recommendations
      socket.on('request_recommendations', async (data) => {
        try {
          const recommendations = await this.recommendationEngine.getRealtimeRecommendations(
            socket.userId,
            data
          );
          socket.emit('recommendations_update', recommendations);
        } catch (_error) {
          socket.emit('error', { message: 'Failed to get recommendations' });
        }
      });

      // Handle analytics events
      socket.on('analytics_event', async (eventData) => {
        try {
          await this.analyticsService.trackEvent({
            ...eventData,
            userId: socket.userId,
            socketId: socket.id,
            timestamp: new Date()
          });
        } catch (_error) {
          logger.error('Failed to track analytics event:', error);
        }
      });

      // Handle user activity
      socket.on('user_activity', async (activityData) => {
        try {
          await this.analyticsService.trackUserActivity({
            ...activityData,
            userId: socket.userId,
            timestamp: new Date()
          });
          
          // Broadcast to user's other sessions
          socket.to(`user_${socket.userId}`).emit('activity_sync', activityData);
        } catch (_error) {
          logger.error('Failed to track user activity:', error);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
      });
    });

    logger.info('✅ WebSocket setup complete');
  }

  /**
   * Setup cron jobs for maintenance tasks
   */
  setupCronJobs() {
    // Daily analytics aggregation (runs at 2 AM)
    cron.schedule('0 2 * * *', async () => {
      try {
        await this.analyticsService.aggregateDailyStats();
        logger.info('Daily analytics aggregation completed');
      } catch (_error) {
        logger.error('Daily analytics aggregation failed:', error);
      }
    });

    // Update recommendation models (runs every 4 hours)
    cron.schedule('0 */4 * * *', async () => {
      try {
        await this.recommendationEngine.updateModels();
        logger.info('Recommendation models updated');
      } catch (_error) {
        logger.error('Recommendation model update failed:', error);
      }
    });

    // Clean expired sessions (runs every hour)
    cron.schedule('0 * * * *', async () => {
      try {
        await this.dbService.cleanExpiredSessions();
        logger.info('Expired sessions cleaned');
      } catch (_error) {
        logger.error('Session cleanup failed:', error);
      }
    });

    // Cache cleanup (runs every 30 minutes)
    cron.schedule('*/30 * * * *', async () => {
      try {
        await this.cacheService.cleanup();
        logger.info('Cache cleanup completed');
      } catch (_error) {
        logger.error('Cache cleanup failed:', error);
      }
    });

    logger.info('✅ Cron jobs setup complete');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    // Express error handler
    this.app.use(errorHandler);

    // Winston error logging
    this.app.use(expressWinston.errorLogger({
      winstonInstance: logger,
      dumpExceptions: true,
      showStack: true
    }));

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      this.shutdown();
    });

    logger.info('✅ Error handling setup complete');
  }

  /**
   * Start the server
   */
  start() {
    this.server.listen(this.port, () => {
      logger.info(`
🚀 Thee Cigar Maestro API Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Server URL: http://localhost:${this.port}
📚 API Docs: http://localhost:${this.port}/api-docs
🏥 Health Check: http://localhost:${this.port}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      
      // Initialize background services
      this.initializeBackgroundServices();
    });
  }

  /**
   * Initialize background services
   */
  async initializeBackgroundServices() {
    try {
      // Start recommendation engine training
      await this.recommendationEngine.initialize();
      logger.info('✅ Recommendation engine initialized');
      
      // Initialize analytics aggregation
      await this.analyticsService.initialize();
      logger.info('✅ Analytics service initialized');
      
      // Start email service
      await this.emailService.initialize();
      logger.info('✅ Email service initialized');
      
    } catch (_error) {
      logger.error('Failed to initialize background services:', error);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      logger.info('Closing server...');
      
      // Close server
      this.server.close(() => {
        logger.info('HTTP server closed');
      });
      
      // Close WebSocket connections
      this.io.close(() => {
        logger.info('WebSocket server closed');
      });
      
      // Close database connection
      await this.dbService.disconnect();
      logger.info('Database connection closed');
      
      // Close cache connection
      await this.cacheService.disconnect();
      logger.info('Cache connection closed');
      
      process.exit(0);
    } catch (_error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Get server instance
   */
  getApp() {
    return this.app;
  }

  /**
   * Get Socket.IO instance
   */
  getIO() {
    return this.io;
  }
}

// Initialize and start server
const server = new CigarMaestroServer();

module.exports = server;