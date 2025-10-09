const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Mock activities data
const activities = [
  {
    id: '1',
    title: '5-Minute Meditation',
    description: 'Quick mindfulness practice to center your thoughts and reduce stress',
    durationMinutes: 5,
    goalTag: 'wellness',
    difficulty: 'easy',
    points: 50,
    icon: '🧘‍♀️'
  },
  {
    id: '2',
    title: 'Speed Reading Practice',
    description: 'Improve reading speed and comprehension with focused exercises',
    durationMinutes: 15,
    goalTag: 'learning',
    difficulty: 'medium',
    points: 100,
    icon: '📚'
  },
  {
    id: '3',
    title: 'Creative Writing Session',
    description: 'Express your creativity through structured writing exercises',
    durationMinutes: 20,
    goalTag: 'creativity',
    difficulty: 'medium',
    points: 120,
    icon: '✍️'
  },
  {
    id: '4',
    title: 'Desk Exercise Routine',
    description: 'Quick workout to energize your body and improve posture',
    durationMinutes: 10,
    goalTag: 'fitness',
    difficulty: 'easy',
    points: 75,
    icon: '💪'
  },
  {
    id: '5',
    title: 'Deep Work Session',
    description: 'Focused work time without distractions',
    durationMinutes: 45,
    goalTag: 'learning',
    difficulty: 'hard',
    points: 200,
    icon: '🎯'
  },
  {
    id: '6',
    title: 'Breathing Exercise',
    description: 'Controlled breathing for relaxation and focus',
    durationMinutes: 3,
    goalTag: 'wellness',
    difficulty: 'easy',
    points: 30,
    icon: '🌬️'
  },
  {
    id: '7',
    title: 'Art Sketching',
    description: 'Express creativity through quick sketching exercises',
    durationMinutes: 25,
    goalTag: 'creativity',
    difficulty: 'medium',
    points: 130,
    icon: '🎨'
  },
  {
    id: '8',
    title: 'Power Walk',
    description: 'Short energizing walk to boost circulation',
    durationMinutes: 15,
    goalTag: 'fitness',
    difficulty: 'easy',
    points: 80,
    icon: '🚶‍♂️'
  }
];

// Mock user data
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    level: 12,
    xp: 2840,
    streak: 7,
    points: 1580
  }
];

// Routes
app.get('/api/activities', (req, res) => {
  console.log('GET /api/activities - Serving activities');
  res.json(activities);
});

app.get('/api/activities/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.post('/api/auth/login', (req, res) => {
  console.log('POST /api/auth/login');
  res.json({
    token: 'mock-jwt-token',
    user: users[0]
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('POST /api/auth/register');
  res.json({
    token: 'mock-jwt-token',
    user: { ...users[0], ...req.body }
  });
});

app.get('/api/user/profile', (req, res) => {
  console.log('GET /api/user/profile');
  res.json(users[0]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${activities.length} activities`);
  console.log('Ready to accept connections from frontend!');
});