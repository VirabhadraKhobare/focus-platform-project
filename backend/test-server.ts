// Simple test to verify backend functionality
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Global declarations for in-memory storage
declare global {
  var inMemoryUsers: any[];
  var inMemorySessions: any[];
  var isMongoConnected: boolean;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global variables for in-memory storage
global.inMemoryUsers = [];
global.inMemorySessions = [];
global.isMongoConnected = false;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: global.isMongoConnected ? 'MongoDB' : 'In-Memory Storage',
    users: global.isMongoConnected ? 'MongoDB Collection' : `${global.inMemoryUsers.length} users in memory`,
    mode: process.env.USE_MONGODB === 'false' ? 'Forced In-Memory' : (global.isMongoConnected ? 'MongoDB Connected' : 'MongoDB Fallback')
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', inMemoryUsers: global.inMemoryUsers.length });
});

// Try to connect to MongoDB
async function connectMongoDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';
    console.log('🔄 Attempting MongoDB connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    global.isMongoConnected = true;
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.log('❌ MongoDB connection failed, using in-memory storage');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    global.isMongoConnected = false;
  }
}

// Start server
connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🗄️ Database mode: ${global.isMongoConnected ? 'MongoDB' : 'In-Memory Storage'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });
});

export default app;