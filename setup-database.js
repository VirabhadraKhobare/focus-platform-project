// MongoDB Database Setup Script for FocusFlow
// Run this script after installing MongoDB or setting up MongoDB Atlas

const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'focusflow';

// Sample data to seed the database
const sampleUsers = [
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2b$10$example.hash', // In real app, this should be bcrypt hashed
    points: 150,
    streak: 7,
    createdAt: new Date(),
    lastActive: new Date()
  }
];

const sampleActivities = [
  {
    title: 'Morning Meditation',
    description: 'Start your day with mindfulness and intention',
    durationMinutes: 10,
    goalTag: 'wellness',
    points: 15,
    difficulty: 'easy',
    icon: '🧘',
    createdAt: new Date()
  },
  {
    title: 'Read 10 Pages',
    description: 'Expand your knowledge with focused reading',
    durationMinutes: 20,
    goalTag: 'learning',
    points: 25,
    difficulty: 'medium',
    icon: '📚',
    createdAt: new Date()
  },
  {
    title: 'Write in Journal',
    description: 'Reflect on your thoughts and goals',
    durationMinutes: 15,
    goalTag: 'creativity',
    points: 20,
    difficulty: 'easy',
    icon: '✍️',
    createdAt: new Date()
  },
  {
    title: 'Exercise for 30 mins',
    description: 'Get your body moving and energized',
    durationMinutes: 30,
    goalTag: 'fitness',
    points: 40,
    difficulty: 'hard',
    icon: '💪',
    createdAt: new Date()
  },
  {
    title: 'Learn New Skill',
    description: 'Spend time learning something new online',
    durationMinutes: 25,
    goalTag: 'learning',
    points: 35,
    difficulty: 'medium',
    icon: '🎯',
    createdAt: new Date()
  }
];

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db(DATABASE_NAME);
    
    // Create collections and indexes
    console.log('🔄 Setting up collections...');
    
    // Users collection
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    // Activities collection
    const activitiesCollection = db.collection('activities');
    await activitiesCollection.createIndex({ goalTag: 1 });
    await activitiesCollection.createIndex({ difficulty: 1 });
    
    // Focus sessions collection
    const focusSessionsCollection = db.collection('focusSessions');
    await focusSessionsCollection.createIndex({ userId: 1 });
    await focusSessionsCollection.createIndex({ createdAt: -1 });
    
    // User activities (completed activities) collection
    const userActivitiesCollection = db.collection('userActivities');
    await userActivitiesCollection.createIndex({ userId: 1, activityId: 1 });
    await userActivitiesCollection.createIndex({ completedAt: -1 });
    
    console.log('✅ Collections and indexes created successfully!');
    
    // Seed sample data
    console.log('🔄 Seeding sample data...');
    
    // Check if data already exists
    const existingUsers = await usersCollection.countDocuments();
    const existingActivities = await activitiesCollection.countDocuments();
    
    if (existingUsers === 0) {
      await usersCollection.insertMany(sampleUsers);
      console.log(`✅ Inserted ${sampleUsers.length} sample users`);
    } else {
      console.log(`ℹ️  Skipping users - ${existingUsers} users already exist`);
    }
    
    if (existingActivities === 0) {
      await activitiesCollection.insertMany(sampleActivities);
      console.log(`✅ Inserted ${sampleActivities.length} sample activities`);
    } else {
      console.log(`ℹ️  Skipping activities - ${existingActivities} activities already exist`);
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log(`📊 Database: ${DATABASE_NAME}`);
    console.log(`🔗 Connection: ${MONGODB_URI}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };