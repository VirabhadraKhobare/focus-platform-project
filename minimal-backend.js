const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

console.log('Starting minimal backend server...');

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

// Basic activities endpoint
app.get('/api/activities', (req, res) => {
  console.log('✅ Activities request received');
  res.json([
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
      title: 'Power Reading',
      description: 'Dedicate 30 minutes to reading educational content.',
      durationMinutes: 30,
      goalTag: 'Learning',
      difficulty: 'Medium',
      points: 50,
      icon: '📚'
    }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
try {
  app.listen(PORT, () => {
    console.log(`🚀 Minimal backend running on http://localhost:${PORT}`);
    console.log(`🔗 CORS enabled for frontend`);
    console.log(`📡 Ready to serve requests!`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
}