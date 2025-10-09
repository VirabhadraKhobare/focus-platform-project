import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Activity {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  goalTag: string;
  difficulty: string;
  points: number;
  icon?: string;
}

// Mock activities for demo purposes
const mockActivities: { [key: string]: Activity } = {
  '1': {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with a peaceful 15-minute meditation session. Focus on your breath and set positive intentions for the day ahead.',
    durationMinutes: 15,
    goalTag: 'Mindfulness',
    difficulty: 'Easy',
    points: 25,
    icon: '🧘‍♀️'
  },
  '2': {
    id: '2',
    title: 'Power Reading Session',
    description: 'Dedicate 30 minutes to reading educational content. Expand your knowledge and stimulate your mind.',
    durationMinutes: 30,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 50,
    icon: '📚'
  },
  '3': {
    id: '3',
    title: 'Creative Writing',
    description: 'Express your thoughts and ideas through creative writing. Let your imagination flow for 25 minutes.',
    durationMinutes: 25,
    goalTag: 'Creativity',
    difficulty: 'Medium',
    points: 40,
    icon: '✍️'
  },
  '4': {
    id: '4',
    title: 'Quick Exercise',
    description: 'Get your blood flowing with a 20-minute workout. Simple exercises to boost your energy.',
    durationMinutes: 20,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 35,
    icon: '💪'
  },
  '5': {
    id: '5',
    title: 'Deep Work Session',
    description: 'Focus on your most important task for 45 minutes without any distractions.',
    durationMinutes: 45,
    goalTag: 'Productivity',
    difficulty: 'Hard',
    points: 75,
    icon: '💻'
  },
  '6': {
    id: '6',
    title: 'Language Practice',
    description: 'Practice a new language for 20 minutes. Expand your linguistic abilities.',
    durationMinutes: 20,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 35,
    icon: '🗣️'
  },
  '7': {
    id: '7',
    title: 'Art Sketching',
    description: 'Express your creativity through art. Spend 30 minutes sketching and exploring your artistic side.',
    durationMinutes: 30,
    goalTag: 'Creativity',
    difficulty: 'Easy',
    points: 45,
    icon: '🎨'
  },
  '8': {
    id: '8',
    title: 'Power Walk',
    description: 'Take a brisk 25-minute walk outdoors. Fresh air and movement to energize your day.',
    durationMinutes: 25,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 30,
    icon: '🚶‍♀️'
  },
  '9': {
    id: '9',
    title: 'Mindful Journaling',
    description: 'Reflect on your thoughts and goals through journaling. A 20-minute self-discovery session.',
    durationMinutes: 20,
    goalTag: 'Mindfulness',
    difficulty: 'Easy',
    points: 25,
    icon: '📝'
  },
  '10': {
    id: '10',
    title: 'Skill Building',
    description: 'Dedicate 40 minutes to learning a new skill or improving an existing one.',
    durationMinutes: 40,
    goalTag: 'Learning',
    difficulty: 'Medium',
    points: 60,
    icon: '🎯'
  },
  '11': {
    id: '11',
    title: 'Music Practice',
    description: 'Practice your musical instrument or explore music theory for 35 minutes.',
    durationMinutes: 35,
    goalTag: 'Creativity',
    difficulty: 'Medium',
    points: 50,
    icon: '🎵'
  },
  '12': {
    id: '12',
    title: 'Yoga Session',
    description: 'Stretch and strengthen your body with a relaxing 30-minute yoga practice.',
    durationMinutes: 30,
    goalTag: 'Health',
    difficulty: 'Easy',
    points: 40,
    icon: '🧘‍♀️'
  }
};

function getMockActivity(id: string | undefined): Activity | null {
  if (!id) return null;
  return mockActivities[id] || null;
}

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    async function fetchActivity() {
      try {
        console.log('Fetching activity with ID:', id);
        const res = await api.get(`/activities/${id}`);
        console.log('Activity data:', res.data);
        setActivity(res.data);
        setTimeLeft(res.data.durationMinutes * 60); // Convert to seconds
      } catch (err) {
        console.error('Error fetching activity:', err);
        // If API fails, use mock data for the demo
        const mockActivity = getMockActivity(id);
        setActivity(mockActivity);
        if (mockActivity) {
          setTimeLeft(mockActivity.durationMinutes * 60);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [id]);

  useEffect(() => {
    let interval: number;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerActive(false);
            handleActivityCompletion();
            return 0;
          }
          return time - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleActivityCompletion = async () => {
    if (!activity) return;
    
    try {
      await api.post(`/activities/${id}/complete`, {
        userId: '1' // Demo user ID
      });
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (err) {
      console.error('Error completing activity:', err);
      // Even if API fails, mark as completed for demo
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(activity ? activity.durationMinutes * 60 : 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!activity) return 0;
    const totalSeconds = activity.durationMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Activity not found</h2>
          <Link to="/daily" className="text-violet-400 underline">Back to activities</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-r from-violet-600 to-cyan-400 p-8 rounded-2xl text-center animate-pulse">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-xl text-white">You earned {activity.points} points!</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link to="/daily" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <span>←</span> Back to Activities
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-white/5 px-3 py-1 rounded-full">
              {activity.goalTag}
            </div>
            <div className="text-sm bg-gradient-to-r from-violet-600 to-cyan-400 px-3 py-1 rounded-full text-white font-medium">
              {activity.points} points
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Info */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              {activity.icon && <span className="text-4xl">{activity.icon}</span>}
              <div>
                <h1 className="text-3xl font-bold">{activity.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded bg-white/10 text-sm">{activity.durationMinutes} min</span>
                  <span className="px-2 py-1 rounded bg-white/10 text-sm">{activity.difficulty}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg mb-8">{activity.description}</p>

            {isCompleted && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span className="text-green-400 font-semibold">Activity Completed!</span>
                </div>
                <p className="text-sm text-green-300 mt-1">Great job! You earned {activity.points} points.</p>
              </div>
            )}
          </div>

          {/* Timer Section */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Focus Timer</h2>
            
            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {isTimerActive ? 'Focus Time' : 'Ready to start'}
                  </div>
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-4">
              {!isTimerActive && timeLeft > 0 && (
                <button
                  onClick={startTimer}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Start Focus
                </button>
              )}
              
              {isTimerActive && (
                <button
                  onClick={pauseTimer}
                  className="px-6 py-3 bg-yellow-500 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Pause
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
              >
                Reset
              </button>
              
              {!isCompleted && timeLeft === 0 && (
                <button
                  onClick={handleActivityCompletion}
                  className="px-6 py-3 bg-green-500 rounded-lg font-semibold hover:shadow-lg transition-all animate-pulse"
                >
                  Mark Complete
                </button>
              )}
            </div>

            {/* Progress Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold">{Math.round(getProgressPercentage())}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold">{Math.floor((activity.durationMinutes * 60 - timeLeft) / 60)}</div>
                <div className="text-xs text-gray-400">Minutes Done</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">💡 Focus Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span>🎯</span>
              <div>
                <div className="font-semibold">Stay Focused</div>
                <div className="text-gray-400">Put away distractions and focus on the task</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>⏰</span>
              <div>
                <div className="font-semibold">Use the Timer</div>
                <div className="text-gray-400">Work in focused bursts for better results</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>🏆</span>
              <div>
                <div className="font-semibold">Celebrate Progress</div>
                <div className="text-gray-400">Acknowledge your achievements, no matter how small</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
