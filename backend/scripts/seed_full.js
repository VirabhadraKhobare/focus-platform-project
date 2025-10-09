// Run: node scripts/seed_full.js after building (or run with ts-node)
const mongoose = require('mongoose');
const Activity = require('../dist/models/Activity').default;
const User = require('../dist/models/User').default;
const bcrypt = require('bcrypt');

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';
const sampleActivities = [
  { title: '5-minute Coding Warmup', description: 'Solve a simple logic puzzle to wake your brain.', durationMinutes: 5, goalTag: 'coding', difficulty: 'Easy', content: '<p>Reverse a string in your language of choice.</p>' },
  { title: '15-minute Deep Study', description: 'Study with uninterrupted focus.', durationMinutes: 15, goalTag: 'study', difficulty: 'Medium', content: '<p>Read one article and summarize 5 points.</p>' },
  { title: '10-minute Creative Writing', description: 'Write a 300-word scene.', durationMinutes: 10, goalTag: 'creativity', difficulty: 'Medium', content: '<p>Prompt: A forgotten door in the attic.</p>' },
  { title: '7-minute Micro Workout', description: 'Quick bodyweight set.', durationMinutes: 7, goalTag: 'fitness', difficulty: 'Easy', content: '<p>3 rounds: 10 squats, 10 push-ups.</p>' },
  { title: '20-minute Project Sprint', description: 'Finish a small task.', durationMinutes: 20, goalTag: 'coding', difficulty: 'Hard', content: '<p>Implement a tiny feature or fix a bug.</p>' },
  { title: '3-minute Breath Reset', description: 'Deep breathing to reset focus.', durationMinutes: 3, goalTag: 'wellness', difficulty: 'Easy', content: '<p>4-4-8 breathing for 3 minutes.</p>' }
];

async function seed(){
  await mongoose.connect(MONGO);
  console.log('Connected. Seeding full dataset...');
  await Activity.deleteMany({});
  await Activity.insertMany(sampleActivities);
  // Users
  await User.deleteMany({});
  const users = [
    { name:'Alice', email:'alice@example.com', password:'password', points:120 },
    { name:'Bob', email:'bob@example.com', password:'password', points:95 },
    { name:'Carl', email:'carl@example.com', password:'password', points:75 }
  ];
  for(const u of users){
    const hash = await bcrypt.hash(u.password,10);
    await User.create({ name:u.name, email:u.email, passwordHash:hash, points:u.points, streak:{ current: Math.floor(Math.random()*10), best: Math.floor(Math.random()*20) } });
  }
  console.log('Seed complete.');
  process.exit(0);
}
seed().catch(e=>{ console.error(e); process.exit(1); });
