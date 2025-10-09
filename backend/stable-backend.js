const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 4000;

console.log('🚀 Starting FocusFlow Backend Server...');

// Enhanced request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📥 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`📥 Origin: ${req.get('Origin') || 'none'}`);
  console.log(`📥 User-Agent: ${req.get('User-Agent') || 'none'}`);
  next();
});

// CORS Configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'FocusFlow Backend is running!',
    port: PORT,
    node_version: process.version
  });
});

// Mock user storage
const users = [];
const completedActivities = [];

// Mock activities data
const activities = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with a peaceful 15-minute meditation session.',
    durationMinutes: 15,
    goalTag: 'Mindfulness',
    difficulty: 'Easy',
    points: 25,
    icon: '🧘‍♀️'
  },
  {
    id: '2',
    title: 'Power Reading Session',
    description: 'Dedicate 30 minutes to reading educational content.',
    durationMinutes: 30,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 50,
    icon: '📚'
  },
  {
    id: '3',
    title: 'Creative Writing',
    description: 'Express yourself through 20 minutes of creative writing.',
    durationMinutes: 20,
    goalTag: 'Creativity',
    difficulty: 'Medium',
    points: 40,
    icon: '✍️'
  }
];

// API Routes
app.get('/api/activities', (req, res) => {
  console.log('✅ Activities requested');
  res.json(activities);
});

app.get('/api/activities/:id', (req, res) => {
  console.log('✅ Single activity requested:', req.params.id);
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  res.json(activity);
});

app.post('/api/activities/:id/complete', (req, res) => {
  console.log('✅ Activity completion requested:', req.params.id);
  const { userId } = req.body;
  const activity = activities.find(a => a.id === req.params.id);
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  completedActivities.push({
    id: Date.now().toString(),
    activityId: req.params.id,
    userId: userId || 'guest',
    completedAt: new Date(),
    points: activity.points
  });
  
  console.log('✅ Activity completed successfully');
  res.json({
    message: 'Activity completed successfully!',
    points: activity.points,
    streak: 1
  });
});

// Authentication Routes
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Registration request received');
  console.log('📝 Request body:', req.body);
  
  const { name, email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    console.log('❌ Registration failed: Missing email or password');
    return res.status(400).json({ 
      message: 'Email and password are required',
      error: 'MISSING_FIELDS' 
    });
  }
  
  if (!email.includes('@')) {
    console.log('❌ Registration failed: Invalid email format');
    return res.status(400).json({ 
      message: 'Please enter a valid email address',
      error: 'INVALID_EMAIL' 
    });
  }
  
  if (password.length < 6) {
    console.log('❌ Registration failed: Password too short');
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long',
      error: 'PASSWORD_TOO_SHORT' 
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    console.log('❌ Registration failed: User already exists');
    return res.status(400).json({ 
      message: 'An account with this email already exists',
      error: 'USER_EXISTS' 
    });
  }
  
  // Create new user
  const user = {
    id: Date.now().toString(),
    name: name || 'User',
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
    points: 100, // Welcome bonus
    streak: 0
  };
  
  users.push(user);
  
  const token = 'focusflow_token_' + user.id + '_' + Date.now();
  
  console.log('✅ User registered successfully:', user.email);
  console.log('✅ Total users:', users.length);
  
  res.status(201).json({
    message: 'Account created successfully!',
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.points,
      streak: user.streak
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login request received');
  console.log('🔐 Request body:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Login failed: Missing email or password');
    return res.status(400).json({ 
      message: 'Email and password are required',
      error: 'MISSING_FIELDS' 
    });
  }
  
  // Find user (for demo, accept any registered user)
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // If user doesn't exist, create them for demo purposes
  if (!user) {
    console.log('🔐 Creating new user for login (demo mode)');
    user = {
      id: Date.now().toString(),
      name: 'Demo User',
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      points: 50,
      streak: 0
    };
    users.push(user);
  }
  
  const token = 'focusflow_token_' + user.id + '_' + Date.now();
  
  console.log('✅ User logged in successfully:', user.email);
  
  res.json({
    message: 'Login successful!',
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.points,
      streak: user.streak
    }
  });
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  console.log('🏆 Leaderboard requested');
  
  const leaderboard = [
    { id: '1', name: 'Alice Johnson', points: 150, streak: 5, rank: 1 },
    { id: '2', name: 'Bob Smith', points: 120, streak: 3, rank: 2 },
    { id: '3', name: 'Charlie Brown', points: 100, streak: 2, rank: 3 },
    { id: '4', name: 'Diana Prince', points: 95, streak: 4, rank: 4 },
    { id: '5', name: 'Ethan Hunt', points: 80, streak: 1, rank: 5 }
  ];
  
  // Add real users to leaderboard
  users.forEach((user, index) => {
    leaderboard.push({
      id: user.id,
      name: user.name,
      points: user.points || 50,
      streak: user.streak || 0,
      rank: leaderboard.length + 1
    });
  });
  
  // Sort by points
  leaderboard.sort((a, b) => b.points - a.points);
  
  // Update ranks
  leaderboard.forEach((user, index) => {
    user.rank = index + 1;
  });
  
  res.json(leaderboard);
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Endpoint not found',
    method: req.method,
    url: req.originalUrl,
    available_endpoints: [
      'GET /health',
      'GET /api/activities',
      'GET /api/activities/:id',
      'POST /api/activities/:id/complete',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/leaderboard'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Create HTTP server
const server = http.createServer(app);

// Server error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please choose a different port.`);
    process.exit(1);
  }
});

// Start server
server.listen(PORT, () => {
  console.log('🎉 =====================================');
  console.log('🎉  FocusFlow Backend Server Started');  
  console.log('🎉 =====================================');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📱 API: http://localhost:${PORT}/api`);
  console.log(`📊 Server Details:`, server.address());
  console.log('🔗 CORS: Enabled for all origins (development mode)');
  console.log('📡 Ready to handle requests!');
  console.log('🎉 =====================================');
  
  // Self-test after startup
  setTimeout(() => {
    const testReq = http.get(`http://localhost:${PORT}/health`, (res) => {
      console.log('✅ Self-test passed - Server is responding correctly');
    }).on('error', (err) => {
      console.error('❌ Self-test failed:', err.message);
    });
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('📴 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('📴 Server closed');
    process.exit(0);
  });
});

console.log('🚀 Backend initialization complete');