import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import activitiesRouter from './routes/activities';
import authRouter from './routes/auth';
// import adminRouter from './routes/admin';
import FocusSession from './models/FocusSession';
import User from './models/User';

dotenv.config();
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';
const PORT = process.env.PORT || 4003;
const USE_MONGODB = process.env.USE_MONGODB === 'true'; // Only use MongoDB if explicitly enabled

// Global declarations for in-memory storage
declare global {
  var inMemoryUsers: any[];
  var inMemorySessions: any[];
  var isMongoConnected: boolean;
}

// In-memory storage for development without MongoDB
let inMemoryUsers: any[] = [];
let inMemorySessions: any[] = [];
let userIdCounter = 1;
let sessionIdCounter = 1;

// Assign to global for access in routes
global.inMemoryUsers = inMemoryUsers;
global.inMemorySessions = inMemorySessions;
global.isMongoConnected = false;

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'], credentials: true }));
app.use(express.json());

// Add MongoDB status to app context
app.locals.useMongoDb = false;

app.use('/api/activities', activitiesRouter);
// app.use('/api/leaderboard', require('./routes/leaderboard').default);
app.use('/api/auth', authRouter);
// app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: global.isMongoConnected ? 'MongoDB' : 'In-Memory Storage',
    users: global.isMongoConnected ? 'MongoDB Collection' : `${global.inMemoryUsers.length} users in memory`,
    mode: process.env.USE_MONGODB === 'false' ? 'Forced In-Memory' : (global.isMongoConnected ? 'MongoDB Connected' : 'MongoDB Fallback')
  });
});

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'] }
});

// Simple socket rooms for focus sessions
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    io.to(roomId).emit('presence', { userId, status: 'joined' });
  });
  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    io.to(roomId).emit('presence', { userId, status: 'left' });
  });
  socket.on('start-session', async ({ roomId, userId, startTime }) => {
    io.to(roomId).emit('session-started', { userId, startTime });
  });
  socket.on('end-session', async ({ roomId, userId, startTime, endTime }) => {
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    const minutes = Math.round(duration / 60000);
    // Persist focus session
    try{
      await FocusSession.create({ userId, roomId, startTime, endTime, duration: minutes });
      // award points & update streak
      const user = await User.findById(userId);
      if(user){
        user.points = (user.points || 0) + Math.max(1, Math.floor(minutes/5));
        const last = user.streak?.lastActive;
        const today = new Date();
        let diffDays = 999;
        if(last) diffDays = Math.floor((today.getTime() - new Date(last).getTime())/86400000);
        if (!user.streak) user.streak = { current: 0, best: 0, lastActive: today };
        if(diffDays === 1) user.streak.current = (user.streak.current || 0) + 1;
        else if(diffDays > 1) user.streak.current = 1;
        user.streak.best = Math.max(user.streak.best || 0, user.streak.current || 0);
        user.streak.lastActive = today;
        await user.save();
      }
    }catch(e){
      console.error('Failed saving session', e);
    }
    io.to(roomId).emit('session-ended', { userId, endTime });
  });
});

async function start() {
  console.log('🚀 Starting server...');
  
  if (USE_MONGODB) {
    try {
      console.log('🔗 Attempting MongoDB connection...');
      await mongoose.connect(MONGO, { 
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        connectTimeoutMS: 10000 // 10 second timeout
      });
      console.log('✅ Connected to MongoDB');
      app.locals.useMongoDb = true;
      global.isMongoConnected = true;
    } catch (error) {
      console.log('📝 MongoDB not available, using in-memory storage (perfect for development!)');
      app.locals.useMongoDb = false;
      global.isMongoConnected = false;
    }
  } else {
    console.log('📝 Using in-memory storage (development mode)');
    app.locals.useMongoDb = false;
    global.isMongoConnected = false;
  }
  
  server.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`💾 Database: In-Memory Storage`);
    console.log(`🔗 CORS enabled for: http://localhost:5173, http://localhost:5174, http://localhost:4173`);
  });
}

start().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
