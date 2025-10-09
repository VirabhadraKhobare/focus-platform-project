import { Router } from 'express';
import User from '../models/User';
const router = Router();

// Mock leaderboard data
const mockLeaderboard = [
  { id: '1', name: 'Alex Johnson', points: 1250, streak: 15 },
  { id: '2', name: 'Sarah Chen', points: 1100, streak: 12 },
  { id: '3', name: 'Mike Rodriguez', points: 950, streak: 8 },
  { id: '4', name: 'Emily Davis', points: 820, streak: 6 },
  { id: '5', name: 'David Kim', points: 750, streak: 5 }
];

router.get('/', async (req, res) => {
  try {
    console.log('🏆 Fetching leaderboard...');
    
    // Try MongoDB first
    if (global.isMongoConnected) {
      const top = await User.find().sort({ points: -1 }).limit(10).select('name points streak');
      if (top.length > 0) {
        res.json(top);
        return;
      }
    }
    
    // Fallback to mock data
    console.log('✅ Returning mock leaderboard');
    res.json(mockLeaderboard);
  } catch (err) {
    console.error('❌ Leaderboard error:', err);
    res.json(mockLeaderboard);
  }
});

export default router;
