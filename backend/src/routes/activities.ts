import { Router } from 'express';
import Activity from '../models/Activity';
// import { adminNotifier } from '../services/AdminNotificationService';

const router = Router();

// Mock activities for demo purposes
const mockActivities = [
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
  },
  {
    id: '5',
    title: 'Deep Work Session',
    description: 'Focus on your most important task for 45 minutes without any distractions.',
    durationMinutes: 45,
    goalTag: 'Productivity',
    difficulty: 'Hard',
    points: 75,
    icon: '💻'
  },
  {
    id: '6',
    title: 'Language Practice',
    description: 'Practice a new language for 20 minutes. Expand your linguistic abilities.',
    durationMinutes: 20,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 35,
    icon: '🗣️'
  },
  {
    id: '7',
    title: 'Art Sketching',
    description: 'Express your creativity through art. Spend 30 minutes sketching and exploring your artistic side.',
    durationMinutes: 30,
    goalTag: 'Creativity',
    difficulty: 'Easy',
    points: 45,
    icon: '🎨'
  },
  {
    id: '8',
    title: 'Power Walk',
    description: 'Take a brisk 25-minute walk outdoors. Fresh air and movement to energize your day.',
    durationMinutes: 25,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 30,
    icon: '🚶‍♀️'
  },
  {
    id: '9',
    title: 'Mindful Journaling',
    description: 'Reflect on your thoughts and goals through journaling. A 20-minute self-discovery session.',
    durationMinutes: 20,
    goalTag: 'Mindfulness',
    difficulty: 'Easy',
    points: 25,
    icon: '📝'
  },
  {
    id: '10',
    title: 'Skill Building',
    description: 'Dedicate 40 minutes to learning a new skill or improving an existing one.',
    durationMinutes: 40,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 60,
    icon: '🎯'
  },
  {
    id: '11',
    title: 'Music Practice',
    description: 'Practice your musical instrument or explore music theory for 35 minutes.',
    durationMinutes: 35,
    goalTag: 'Creativity',
    difficulty: 'Medium',
    points: 50,
    icon: '🎵'
  },
  {
    id: '12',
    title: 'Yoga Session',
    description: 'Stretch and strengthen your body with a relaxing 30-minute yoga practice.',
    durationMinutes: 30,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 40,
    icon: '🧘‍♀️'
  }
];

// GET /api/activities/daily?goal=coding
router.get('/daily', async (req, res) => {
  try {
    const goal = req.query.goal as string | undefined;
    
    // Try MongoDB first
    if (global.isMongoConnected) {
      const filter: any = {};
      if (goal) filter.goalTag = goal;
      const activities = await Activity.find(filter).sort({ createdAt: -1 }).limit(12).lean();
      res.json({ activities });
      return;
    }
    
    // Fallback to mock data
    let activities = mockActivities;
    if (goal) {
      activities = mockActivities.filter(activity => 
        activity.goalTag.toLowerCase() === goal.toLowerCase()
      );
    }
    
    res.json({ activities });
  } catch (err) {
    console.error('❌ Activities error:', err);
    // Always provide mock data as fallback
    res.json({ activities: mockActivities });
  }
});

// GET /api/activities/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching activity with ID:', id);
    
    // Try MongoDB first
    if (global.isMongoConnected) {
      const activity = await Activity.findById(id).lean();
      if (activity) {
        res.json(activity);
        return;
      }
    }
    
    // Fallback to mock data
    const activity = mockActivities.find(a => a.id === id);
    if (activity) {
      console.log('✅ Found mock activity:', activity.title);
      res.json(activity);
      return;
    }
    
    console.log('❌ Activity not found for ID:', id);
    res.status(404).json({ message: 'Activity not found' });
  } catch (err) {
    console.error('❌ Error fetching activity:', err);
    res.status(500).json({ message: 'Failed to fetch activity' });
  }
});

// POST /api/activities/:id/complete
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Find the activity details
    const activity = mockActivities.find(a => a.id === id);
    const activityTitle = activity ? activity.title : `Activity ${id}`;
    
    // Send admin notification
    // await adminNotifier.sendNotification({
    //   type: 'activity_completed',
    //   user: { id: userId, name: 'User', email: 'user@example.com' }, // In real app, fetch user details
    //   timestamp: new Date(),
    //   ip: req.ip,
    //   userAgent: req.get('User-Agent'),
    //   details: {
    //     activityId: id,
    //     activityTitle: activityTitle,
    //     points: activity ? activity.points : 25
    //   }
    // });
    
    console.log('✅ Activity completed:', { id, userId });
    
    // For demo purposes, just return success
    // In a real app, you'd save this to the database
    res.json({ 
      message: 'Activity completed successfully!', 
      points: activity ? activity.points : 25,
      streak: 1 
    });
  } catch (err) {
    console.error('❌ Error completing activity:', err);
    res.status(500).json({ message: 'Failed to complete activity' });
  }
});

export default router;
