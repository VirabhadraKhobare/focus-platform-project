const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// In-memory database simulation (for development without MongoDB)
let users = [
  { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'demo123', points: 150, streak: 7 }
];

let activities = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with mindfulness and inner peace',
    durationMinutes: 10,
    goalTag: 'wellness',
    points: 15,
    difficulty: 'easy',
    icon: '🧘‍♀️'
  },
  {
    id: '2',
    title: 'Read 10 Pages',
    description: 'Expand your knowledge with focused reading session',
    durationMinutes: 20,
    goalTag: 'learning',
    points: 25,
    difficulty: 'medium',
    icon: '📚'
  },
  {
    id: '3',
    title: 'Write in Journal',
    description: 'Reflect on your thoughts, goals, and daily experiences',
    durationMinutes: 15,
    goalTag: 'creativity',
    points: 20,
    difficulty: 'easy',
    icon: '📝'
  },
  {
    id: '4',
    title: 'Exercise for 30 mins',
    description: 'Get your body moving and energized with physical activity',
    durationMinutes: 30,
    goalTag: 'fitness',
    points: 40,
    difficulty: 'hard',
    icon: '💪'
  },
  {
    id: '5',
    title: 'Learn New Skill',
    description: 'Spend focused time learning something new online or through practice',
    durationMinutes: 25,
    goalTag: 'learning',
    points: 35,
    difficulty: 'medium',
    icon: '🎯'
  }
];

let focusSessions = [];
let leaderboard = [
  { id: '1', name: 'Demo User', points: 150, streak: 7 },
  { id: '2', name: 'Alice Johnson', points: 280, streak: 12 },
  { id: '3', name: 'Bob Smith', points: 195, streak: 5 },
  { id: '4', name: 'Carol Davis', points: 340, streak: 15 },
  { id: '5', name: 'David Wilson', points: 120, streak: 3 }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user && user.password === password) {
    res.json({ 
      token: 'mock-jwt-token-' + user.id, 
      user: { id: user.id, name: user.name, email: user.email, points: user.points, streak: user.streak }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password,
    points: 0,
    streak: 0
  };
  
  users.push(newUser);
  
  res.json({ 
    token: 'mock-jwt-token-' + newUser.id, 
    user: { id: newUser.id, name: newUser.name, email: newUser.email, points: newUser.points, streak: newUser.streak }
  });
});

// Activities endpoints
app.get('/api/activities', (req, res) => {
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

app.post('/api/activities/:id/complete', (req, res) => {
  const { userId } = req.body;
  const activity = activities.find(a => a.id === req.params.id);
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  // Update user points and streak
  const user = users.find(u => u.id === userId);
  if (user) {
    user.points += activity.points;
    user.streak += 1;
    
    // Update leaderboard
    const leaderEntry = leaderboard.find(l => l.id === userId);
    if (leaderEntry) {
      leaderEntry.points = user.points;
      leaderEntry.streak = user.streak;
    } else {
      leaderboard.push({
        id: user.id,
        name: user.name,
        points: user.points,
        streak: user.streak
      });
    }
    
    // Sort leaderboard by points
    leaderboard.sort((a, b) => b.points - a.points);
  }
  
  res.json({ 
    message: 'Activity completed!', 
    pointsEarned: activity.points,
    newTotal: user ? user.points : 0
  });
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard.slice(0, 10)); // Top 10
});

// Focus sessions endpoints
app.post('/api/focus-sessions', (req, res) => {
  const { userId, roomId, startTime, endTime, duration } = req.body;
  
  const session = {
    id: (focusSessions.length + 1).toString(),
    userId,
    roomId,
    startTime,
    endTime,
    duration
  };
  
  focusSessions.push(session);
  
  // Award points for focus session
  const user = users.find(u => u.id === userId);
  if (user) {
    const points = Math.min(duration, 60); // Max 60 points for 60+ minute sessions
    user.points += points;
    
    // Update leaderboard
    const leaderEntry = leaderboard.find(l => l.id === userId);
    if (leaderEntry) {
      leaderEntry.points = user.points;
    }
    leaderboard.sort((a, b) => b.points - a.points);
  }
  
  res.json(session);
});

app.get('/api/focus-sessions/:userId', (req, res) => {
  const userSessions = focusSessions.filter(s => s.userId === req.params.userId);
  res.json(userSessions);
});

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173'] }
});

// Socket.IO for real-time focus rooms
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    
    socket.on('join-room', ({ roomId, userId, userName }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { userId, userName });
        console.log(`User ${userName} joined room ${roomId}`);
    });
    
    socket.on('leave-room', ({ roomId, userId, userName }) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', { userId, userName });
        console.log(`User ${userName} left room ${roomId}`);
    });
    
    socket.on('start-session', ({ roomId, userId, userName, startTime }) => {
        io.to(roomId).emit('session-started', { userId, userName, startTime });
        console.log(`Focus session started in room ${roomId} by ${userName}`);
    });
    
    socket.on('end-session', ({ roomId, userId, userName, startTime, endTime }) => {
        const duration = Math.round((new Date(endTime) - new Date(startTime)) / 60000);
        io.to(roomId).emit('session-ended', { userId, userName, duration });
        console.log(`Focus session ended in room ${roomId} by ${userName}, duration: ${duration} minutes`);
        
        // Save session to database
        const session = {
            id: (focusSessions.length + 1).toString(),
            userId,
            roomId,
            startTime,
            endTime,
            duration
        };
        focusSessions.push(session);
    });
    
    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Enhanced FocusFlow Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: In-memory simulation (${users.length} users, ${activities.length} activities)`);
  console.log(`🔥 Features: Auth, Activities, Leaderboard, Focus Rooms with Socket.IO`);
});