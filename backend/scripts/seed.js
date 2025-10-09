// Run: node scripts/seed.js after installing dependencies and configuring MONGODB_URI
const mongoose = require('mongoose');
const Activity = require('../dist/models/Activity').default;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow';
const sample = [
  { title: '5-minute Coding Warmup', description: 'Solve a simple logic puzzle to wake your brain.', durationMinutes: 5, goalTag: 'coding', difficulty: 'Easy', content: 'Write a small function to reverse a string.' },
  { title: '15-minute Deep Study', description: 'Choose a topic and study with uninterrupted focus.', durationMinutes: 15, goalTag: 'study', difficulty: 'Medium', content: 'Read one article and take 5 notes.' },
  { title: '10-minute Creative Writing', description: 'Write a 300-word short scene.', durationMinutes: 10, goalTag: 'creativity', difficulty: 'Medium', content: 'Prompt: A forgotten door in the attic.' },
  { title: '7-minute Micro Workout', description: 'A quick set of bodyweight exercises.', durationMinutes: 7, goalTag: 'fitness', difficulty: 'Easy', content: '3 rounds of 10 squats and 10 push-ups.' },
  { title: '20-minute Project Sprint', description: 'Pick one small task in your project and finish it.', durationMinutes: 20, goalTag: 'coding', difficulty: 'Hard', content: 'Implement a new component or fix a bug.' },
];

async function seed() {
  await mongoose.connect(MONGO);
  console.log('Connected. Seeding...');
  await Activity.deleteMany({});
  await Activity.insertMany(sample);
  console.log('Seeded sample activities.');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
