import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';

// Global declarations for in-memory storage
declare global {
  var inMemoryUsers: any[];
  var inMemorySessions: any[];
  var isMongoConnected: boolean;
}

// Initialize global arrays
global.inMemoryUsers = [];
global.inMemorySessions = [];
global.isMongoConnected = false;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

// Simple health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: global.isMongoConnected ? 'MongoDB' : 'In-Memory Storage',
    users: global.isMongoConnected ? 'MongoDB Collection' : `${global.inMemoryUsers.length} users in memory`,
    mode: process.env.USE_MONGODB === 'false' ? 'Forced In-Memory' : (global.isMongoConnected ? 'MongoDB Connected' : 'MongoDB Fallback')
  });
});

// Simple test route for auth
app.post('/api/auth/test', (req, res) => {
  console.log('🧪 Test auth route called');
  console.log('📄 Request body:', req.body);
  console.log('🗄️ In-memory users:', global.inMemoryUsers.length);
  res.json({ message: 'Auth test working', inMemoryUsers: global.inMemoryUsers.length });
});

// Import routes after global setup
import authRouter from './routes/auth';
app.use('/api/auth', authRouter);

async function start() {
  console.log('🚀 Starting server...');
  
  const USE_MONGODB = process.env.USE_MONGODB !== 'false';
  
  if (USE_MONGODB) {
    try {
      console.log('🔗 Attempting MongoDB connection...');
      await mongoose.connect(MONGO, { 
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        connectTimeoutMS: 10000 // 10 second timeout
      });
      console.log('✅ Connected to MongoDB');
      global.isMongoConnected = true;
    } catch (error) {
      console.warn('⚠️  MongoDB connection failed, falling back to in-memory storage');
      console.warn('   Error:', error instanceof Error ? error.message : String(error));
      global.isMongoConnected = false;
    }
  } else {
    console.log('📝 Using in-memory storage (MongoDB disabled)');
    global.isMongoConnected = false;
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`💾 Database: ${global.isMongoConnected ? 'MongoDB' : 'In-Memory Storage'}`);
    console.log(`🔗 CORS enabled for: http://localhost:5173, http://localhost:5174`);
  });
}

start().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});