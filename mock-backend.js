const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// Mock endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    token: 'mock-token', 
    user: { id: '1', name: 'Test User', email: req.body.email } 
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    token: 'mock-token', 
    user: { id: '1', name: req.body.name, email: req.body.email } 
  });
});

app.get('/api/activities', (req, res) => {
  res.json([
    { id: '1', title: 'Sample Activity', description: 'A sample activity', points: 10 }
  ]);
});

app.get('/api/leaderboard', (req, res) => {
  res.json([
    { id: '1', name: 'Test User', points: 100, streak: 5 }
  ]);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
});