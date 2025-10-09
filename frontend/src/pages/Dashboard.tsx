import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  activitiesCompleted: number;
  focusTimeMinutes: number;
}

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

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  streak: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentStreak: 0,
    activitiesCompleted: 0,
    focusTimeMinutes: 0
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('📊 Fetching dashboard data...');
        const [activitiesRes, leaderboardRes] = await Promise.all([
          api.get('/activities/daily').catch(() => ({ data: { activities: [] } })),
          api.get('/leaderboard').catch(() => ({ data: [] }))
        ]);
        
        // Handle activities response structure
        const activitiesData = activitiesRes.data.activities || activitiesRes.data || [];
        setActivities(activitiesData.slice(0, 6)); // Show first 6 activities
        setLeaderboard(leaderboardRes.data || []);
        
        // Mock user stats (in a real app, this would come from the backend)
        setUserStats({
          totalPoints: user?.points || 150,
          currentStreak: user?.streak || 7,
          activitiesCompleted: 12,
          focusTimeMinutes: 240
        });
        
        console.log('✅ Dashboard data loaded');
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        // Provide fallback mock data
        setActivities([
          {
            id: '1',
            title: 'Morning Meditation',
            description: 'Start your day with mindfulness',
            durationMinutes: 15,
            goalTag: 'Mindfulness',
            difficulty: 'Easy',
            points: 25,
            icon: '🧘‍♀️'
          },
          {
            id: '2',
            title: 'Power Reading Session',
            description: 'Expand your knowledge',
            durationMinutes: 30,
            goalTag: 'Learning',
            difficulty: 'Medium',
            points: 50,
            icon: '📚'
          },
          {
            id: '3',
            title: 'Creative Writing',
            description: 'Express your thoughts',
            durationMinutes: 25,
            goalTag: 'Creativity',
            difficulty: 'Medium',
            points: 40,
            icon: '✍️'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const getMotivationalMessage = () => {
    const messages = [
      "You're on fire! Keep the momentum going! 🔥",
      "Every small step counts towards your goals! 🎯",
      "Consistency is key to success! 💪",
      "You're building amazing habits! ⭐",
      "Your future self will thank you! 🚀"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getWeeklyGoal = () => {
    const completedThisWeek = 7; // Mock data
    const weeklyGoal = 10;
    return { completed: completedThisWeek, goal: weeklyGoal };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const weeklyGoal = getWeeklyGoal();
  const weeklyProgress = (weeklyGoal.completed / weeklyGoal.goal) * 100;

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
                FocusFlow
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/daily" className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                Today's Focus
              </Link>
              <div className="relative group">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                  {user?.name?.charAt(0) || '👤'}
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-10 w-48 glass rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-white/10">
                    <p className="font-semibold">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-400">{user?.email || ''}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/daily" className="block px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors">
                      🎯 Today's Focus
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors text-red-400"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back{user ? `, ${user.name}` : ''}! 
          </h1>
          <p className="text-gray-300 text-lg">{getMotivationalMessage()}</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-violet-400">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-400">{userStats.currentStreak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400">{userStats.activitiesCompleted}</div>
            <div className="text-sm text-gray-400">Activities Done</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-cyan-400">{userStats.focusTimeMinutes}</div>
            <div className="text-sm text-gray-400">Focus Minutes</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Progress */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Weekly Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Activities this week</span>
                  <span className="text-sm font-semibold">{weeklyGoal.completed}/{weeklyGoal.goal}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-cyan-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${weeklyProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                {weeklyProgress >= 100 
                  ? "🎉 Congratulations! You've reached your weekly goal!" 
                  : `${weeklyGoal.goal - weeklyGoal.completed} more activities to reach your weekly goal!`
                }
              </p>
            </div>

            {/* Quick Start Activities */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <div className="grid gap-3">
                {activities.slice(0, 3).map((activity) => (
                  <Link 
                    key={activity.id}
                    to={`/activity/${activity.id}`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group transform hover:scale-102"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-violet-400 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-400">{activity.durationMinutes} min • {activity.points} points</p>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">→</div>
                  </Link>
                ))}
                <Link 
                  to="/daily"
                  className="mt-2 text-center py-2 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View all activities →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Achievement Badge */}
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold mb-4">Latest Achievement</h3>
              <div className="text-4xl mb-3">🎯</div>
              <div className="font-semibold text-violet-400 mb-1">Week Warrior</div>
              <div className="text-sm text-gray-400">Completed 7 days in a row!</div>
            </div>

            {/* Leaderboard */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-white/10'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm">{entry.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{entry.points} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Timer Status */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Focus Status</h3>
              <div className="text-center">
                <div className="text-3xl mb-2">😌</div>
                <div className="text-sm text-gray-400 mb-3">Ready to focus</div>
                <Link 
                  to="/daily"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Start Session
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            to="/daily"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Browse Activities
          </Link>
          <Link 
            to="/focus-room"
            className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all transform hover:scale-105"
          >
            Join Focus Room
          </Link>
        </div>
      </div>
    </div>
  );
}
