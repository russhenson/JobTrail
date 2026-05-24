const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const jobRoutes = require('./src/routes/jobRoutes');

// Initialize Express app
const app = express();

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */

// Enable Cross-Origin requests (frontend ↔ backend)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

/**
 * =========================
 * ROUTES
 * =========================
 */

// Auth routes (register, login)
app.use('/auth', authRoutes);

// Job application routes (CRUD)
app.use('/jobs', jobRoutes);

// Health check route (useful for testing server status)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'JobTrail API',
    timestamp: new Date().toISOString(),
  });
});

/**
 * =========================
 * SERVER START
 * =========================
 */

const PORT = process.env.PORT || 5000;

/**
 * Start server only after DB connection succeeds
 * This prevents running API without MongoDB connection
 */
const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB first

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// Boot the server
startServer();
