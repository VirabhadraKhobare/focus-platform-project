const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

console.log('Starting minimal backend server...');

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`📥 Headers:`, req.headers);
  next();
});

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Test endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check received');
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Minimal backend is working!'
  });
});

// Mock data
const activities = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with a peaceful 15-minute meditation session. Focus on your breath and set positive intentions for the day ahead.',
    durationMinutes: 15,
    goalTag: 'Mindfulness',
    difficulty: 'Easy',
    points: 25,
    icon: '🧘‍♀️'
  },
  {
    id: '2',
    title: 'Power Reading Session',
    description: 'Dedicate 30 minutes to reading educational content. Expand your knowledge and stimulate your mind.',
    durationMinutes: 30,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 50,
    icon: '📚'
  },
  {
    id: '3',
    title: 'Creative Writing',
    description: 'Express your thoughts and ideas through creative writing. Let your imagination flow for 25 minutes.',
    durationMinutes: 25,
    goalTag: 'Creativity',
    difficulty: 'Medium',
    points: 40,
    icon: '✍️'
  },
  {
    id: '4',
    title: 'Quick Exercise',
    description: 'Get your blood flowing with a 20-minute workout. Simple exercises to boost your energy.',
    durationMinutes: 20,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 35,
    icon: '💪'
  }
];

let users = [];
let completedActivities = [];

// Activities endpoints
app.get('/api/activities', (req, res) => {
  console.log('✅ Activities request received');
  res.json(activities);
});

app.get('/api/activities/:id', (req, res) => {
  console.log('✅ Single activity request:', req.params.id);
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  res.json(activity);
});

app.post('/api/activities/:id/complete', (req, res) => {
  console.log('✅ Activity completion request:', req.params.id);
  const { userId } = req.body;
  const activity = activities.find(a => a.id === req.params.id);
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  // Store completion
  completedActivities.push({
    activityId: req.params.id,
    userId,
    completedAt: new Date(),
    points: activity.points
  });
  
  res.json({
    message: 'Activity completed successfully!',
    points: activity.points,
    streak: 1
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  console.log('✅ Register request received');
  const { name, email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  // Check if user exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create user
  const user = {
    id: Date.now().toString(),
    name: name || 'User',
    email,
    createdAt: new Date()
  };
  
  users.push(user);
  
  res.json({
    token: 'mock-jwt-token-' + user.id,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('✅ Login request received');
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  // Find user (for demo, accept any registered user)
  let user = users.find(u => u.email === email);
  
  // If user doesn't exist, create them (for demo purposes)
  if (!user) {
    user = {
      id: Date.now().toString(),
      name: 'Demo User',
      email,
      createdAt: new Date()
    };
    users.push(user);
  }
  
  res.json({
    token: 'mock-jwt-token-' + user.id,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  console.log('✅ Leaderboard request received');
  res.json([
    { id: '1', name: 'Alice Johnson', points: 150, streak: 5, rank: 1 },
    { id: '2', name: 'Bob Smith', points: 120, streak: 3, rank: 2 },
    { id: '3', name: 'Charlie Brown', points: 100, streak: 2, rank: 3 },
    { id: '4', name: 'Diana Prince', points: 95, streak: 4, rank: 4 },
    { id: '5', name: 'Ethan Hunt', points: 80, streak: 1, rank: 5 }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
try {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Minimal backend running on http://localhost:${PORT}`);
    console.log(`🔗 CORS enabled for frontend`);
    console.log(`📡 Ready to serve requests!`);
    console.log(`📊 Server address:`, server.address());
    
    // Test the server internally
    setTimeout(() => {
      const http = require('http');
      const testReq = http.get(`http://localhost:${PORT}/health`, (res) => {
        console.log('✅ Internal health check passed:', res.statusCode);
      }).on('error', (err) => {
        console.error('❌ Internal health check failed:', err.message);
      });
    }, 1000);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
    }
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
}