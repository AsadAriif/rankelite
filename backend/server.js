const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const settingRoutes = require('./routes/settingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: '*', // Allow connections from frontend and admin panel
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Uploads & Public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Root standalone portal fallback
const standalonePath = path.join(__dirname, '../../index.html');
app.get(['/portal', '/standalone', '/index.html'], (req, res) => {
  if (fs.existsSync(standalonePath)) {
    return res.sendFile(standalonePath);
  }
  res.redirect('/');
});

// Serve Frontend Dist if available
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'EliteRank 100-Tier Luxury API Engine',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// SPA Client-side Route Catch-All
if (fs.existsSync(frontendDistPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  logger.info(`✨ EliteRank Luxury API & Frontend Server running on port ${PORT}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💎 Web App URL: http://localhost:${PORT}`);
});
