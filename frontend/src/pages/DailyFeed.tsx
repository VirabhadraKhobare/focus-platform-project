import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import FloatingActionButton from '../components/FloatingActionButton';
import NotificationSystem from '../components/NotificationSystem';
import { useAuth } from '../hooks/useAuth';
import { useNotificationManager } from '../hooks/useNotificationManager';

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

interface DailyQuote {
  text: string;
  author: string;
}

interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  totalPoints: number;
  todayCompleted: number;
  todayGoal: number;
  avatar: string;
}

export default function DailyFeed(){
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { resetDailyNotifications } = useNotificationManager();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Toast notification function
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const toastDiv = document.createElement('div');
    toastDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass rounded-lg p-4 border ${
      type === 'success' ? 'border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-400/20' :
      type === 'info' ? 'border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-cyan-400/20' :
      'border-orange-500/30 bg-gradient-to-r from-orange-500/20 to-yellow-400/20'
    } animate-in slide-in-from-top duration-300`;
    
    toastDiv.innerHTML = `
      <div class="flex items-center gap-2 text-white">
        <span class="text-lg">${type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️'}</span>
        <span class="font-medium">${message}</span>
      </div>
    `;
    
    document.body.appendChild(toastDiv);
    
    setTimeout(() => {
      toastDiv.classList.add('animate-out', 'slide-out-to-top');
      setTimeout(() => {
        document.body.removeChild(toastDiv);
      }, 300);
    }, 3000);
  };
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [dailyQuote, setDailyQuote] = useState<DailyQuote>({ text: '', author: '' });
  const [smartRecommendation, setSmartRecommendation] = useState('');
  const [focusScore, setFocusScore] = useState(87);
  const [peakHours, setPeakHours] = useState({ start: '9:00 AM', end: '11:00 AM' });
  const [autoSuggestTimer, setAutoSuggestTimer] = useState<NodeJS.Timeout | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState([
    {
      icon: '🧘',
      title: '5-Min Mindfulness',
      reason: 'Perfect for your current energy level',
      confidence: 94
    },
    {
      icon: '📚',
      title: 'Speed Reading',
      reason: 'High engagement activity trending now',
      confidence: 87
    },
    {
      icon: '💪',
      title: 'Desk Exercises',
      reason: 'Great for afternoon energy boost',
      confidence: 82
    }
  ]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.name || 'Alex Johnson',
    level: 12,
    xp: 2840,
    xpToNext: 3000,
    streak: user?.streak || 7,
    totalPoints: user?.points || 1580,
    todayCompleted: 3,
    todayGoal: 5,
    avatar: '🌟'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Set time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');

    // Set daily inspirational quote
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Your limitation—it's only your imagination.", author: "Unknown" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
      { text: "Great things never come from comfort zones.", author: "Unknown" },
      { text: "Dream it. Wish it. Do it.", author: "Unknown" },
      { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
      { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" }
    ];
    const todayQuote = quotes[new Date().getDate() % quotes.length];
    setDailyQuote(todayQuote);

    // Smart recommendation based on time and user behavior
    const generateSmartRecommendation = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 12) {
        setSmartRecommendation('wellness');
        setPeakHours({ start: '9:00 AM', end: '11:00 AM' });
      } else if (currentHour >= 12 && currentHour < 17) {
        setSmartRecommendation('learning');
        setPeakHours({ start: '2:00 PM', end: '4:00 PM' });
      } else if (currentHour >= 17 && currentHour < 20) {
        setSmartRecommendation('fitness');
        setPeakHours({ start: '5:00 PM', end: '7:00 PM' });
      } else {
        setSmartRecommendation('creativity');
        setPeakHours({ start: '8:00 PM', end: '10:00 PM' });
      }
    };

    generateSmartRecommendation();

    // Auto-suggest category changes based on time
    const autoSuggestInterval = setInterval(() => {
      generateSmartRecommendation();
      
      // Clear previous timer if exists
      if (autoSuggestTimer) {
        clearTimeout(autoSuggestTimer);
      }
      
      // Automatically switch to recommended category after 30 seconds of inactivity
      const autoSwitchTimer = setTimeout(() => {
        setSelectedCategory(current => {
          if (current === 'all') {
            return smartRecommendation || 'wellness';
          }
          return current;
        });
      }, 30000);

      setAutoSuggestTimer(autoSwitchTimer);
    }, 60000); // Check every minute

    // Dynamic focus score calculation
    const currentHour = new Date().getHours();
    const calculateFocusScore = () => {
      const baseScore = 60;
      const streakBonus = Math.min(userProfile.streak * 3, 30);
      const timeBonus = (currentHour >= 9 && currentHour <= 11) ? 15 : 0;
      const completionBonus = (userProfile.todayCompleted / userProfile.todayGoal) * 15;
      return Math.min(baseScore + streakBonus + timeBonus + completionBonus, 100);
    };

    setFocusScore(Math.round(calculateFocusScore()));

    // Fetch activities
    async function fetchActivities(){
      try{
        console.log('Fetching activities from backend...');
        const res = await axios.get('http://localhost:4000/api/activities');
        console.log('Backend response:', res.data);
        setActivities(res.data || []);
        setError(null);
      }catch(err){
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please check if the backend server is running.');
        // Mock data for development when backend is not available
        setActivities([
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
            description: 'Focused work time without distractions for maximum productivity',
            durationMinutes: 45,
            goalTag: 'learning',
            difficulty: 'hard',
            points: 200,
            icon: '🎯'
          },
          {
            id: '6',
            title: 'Breathing Exercise',
            description: 'Controlled breathing techniques for relaxation and mental clarity',
            durationMinutes: 3,
            goalTag: 'wellness',
            difficulty: 'easy',
            points: 30,
            icon: '🌬️'
          },
          {
            id: '7',
            title: 'Art Sketching',
            description: 'Express creativity through guided sketching and drawing exercises',
            durationMinutes: 25,
            goalTag: 'creativity',
            difficulty: 'medium',
            points: 130,
            icon: '🎨'
          },
          {
            id: '8',
            title: 'Power Walk',
            description: 'Short energizing walk to boost circulation and mental clarity',
            durationMinutes: 15,
            goalTag: 'fitness',
            difficulty: 'easy',
            points: 80,
            icon: '🚶‍♂️'
          }
        ]);
      }finally{
        setLoading(false);
      }
    }

    fetchActivities();

    return () => {
      clearInterval(autoSuggestInterval);
      if (autoSuggestTimer) clearTimeout(autoSuggestTimer);
    };
  }, []); // Empty dependency array to run once on mount

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-violet-500/10 rounded-full animate-pulse" style={{ animation: 'pulse 2s infinite, bounce 3s infinite' }}></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-400/10 rounded-full animate-pulse" style={{ animation: 'pulse 2s infinite, bounce 3s infinite', animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-violet-600/10 rounded-full animate-pulse" style={{ animation: 'pulse 2s infinite, bounce 3s infinite', animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-500/10 rounded-full animate-pulse" style={{ animation: 'pulse 2s infinite, bounce 3s infinite', animationDelay: '0.5s' }}></div>
        </div>

        <div className="text-center z-10 glass rounded-2xl p-12 max-w-md mx-6">
          {/* Loading Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-violet-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30"></div>
              <div className="absolute inset-2 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            {authLoading ? 'Authenticating...' : 'Preparing Your Journey'}
          </h2>
          
          {/* Motivational Loading Messages */}
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-300">
              {authLoading ? '🔐 Verifying your access' : '✨ Curating perfect activities for you'}
            </p>
            <p className="text-sm text-gray-400 animate-pulse">
              {authLoading ? 'Just a moment...' : 'Success is built one focused moment at a time...'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">
                {authLoading ? 'Checking authentication' : 'Loading activities'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse delay-300"></div>
              <span className="text-gray-300">
                {authLoading ? 'Loading user profile' : 'Personalizing content'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-700"></div>
              <span className="text-gray-300">Almost ready...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'All', icon: '🎯', count: activities?.length || 0 },
    { id: 'wellness', name: 'Wellness', icon: '🧘‍♀️', count: activities?.filter(a => a?.goalTag === 'wellness')?.length || 0 },
    { id: 'learning', name: 'Learning', icon: '📚', count: activities?.filter(a => a?.goalTag === 'learning')?.length || 0 },
    { id: 'creativity', name: 'Creativity', icon: '🎨', count: activities?.filter(a => a?.goalTag === 'creativity')?.length || 0 },
    { id: 'fitness', name: 'Fitness', icon: '💪', count: activities?.filter(a => a?.goalTag === 'fitness')?.length || 0 },
  ];

  const filteredActivities = selectedCategory === 'all' 
    ? (activities || [])
    : (activities || []).filter(activity => activity?.goalTag === selectedCategory);

  const profileXpPercentage = userProfile.xpToNext > 0 ? (userProfile.xp / userProfile.xpToNext) * 100 : 0;
  const todayProgressPercentage = userProfile.todayGoal > 0 ? (userProfile.todayCompleted / userProfile.todayGoal) * 100 : 0;

  return (
    <div className="min-h-screen">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
                Today's Focus
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                Dashboard
              </Link>
              <div className="relative group">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                  {userProfile.avatar}
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-10 w-48 glass rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-white/10">
                    <p className="font-semibold">{userProfile.name}</p>
                    <p className="text-sm text-gray-400">Level {userProfile.level}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors">
                      📊 Dashboard
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {userProfile.avatar}
              </div>
              <h3 className="text-xl font-bold mb-1">{userProfile.name}</h3>
              <p className="text-sm text-gray-400 mb-4">Level {userProfile.level} Explorer</p>
              
              {/* XP Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>XP</span>
                  <span>{userProfile.xp}/{userProfile.xpToNext}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileXpPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-400">{userProfile.streak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-lg font-bold text-violet-400">{userProfile.totalPoints}</div>
                  <div className="text-xs text-gray-400">Total Points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Quote & Progress */}
          <div className="lg:col-span-3 space-y-6">
            {/* Greeting & Quote */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-2">
                Good {timeOfDay}, {userProfile.name}! 👋
              </h2>
              <div className="bg-gradient-to-r from-violet-600/20 to-cyan-400/20 rounded-lg p-4 border border-violet-500/30">
                <p className="text-lg italic mb-2">"{dailyQuote.text}"</p>
                <p className="text-sm text-gray-400">— {dailyQuote.author}</p>
              </div>
            </div>

            {/* Today's Progress */}
            <div className="glass rounded-2xl p-6" data-progress-section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Today's Progress</h3>
                <span className="text-sm text-gray-400">{userProfile.todayCompleted}/{userProfile.todayGoal} completed</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min(todayProgressPercentage, 100)}%` }}
                >
                  {todayProgressPercentage >= 20 && (
                    <span className="text-xs font-bold text-white">
                      {Math.round(todayProgressPercentage)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Keep going! You're doing great 💪</span>
                {todayProgressPercentage >= 100 && (
                  <span className="text-green-400 font-semibold">🎉 Goal reached!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Focus Area Selection */}
        <div className="mb-8" data-focus-areas>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎯 Smart Focus Areas</h3>
              <p className="text-gray-400">AI-curated categories based on your progress and goals</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live recommendations</span>
            </div>
          </div>

          {/* Smart Recommendations Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <div>
                  <p className="font-semibold text-violet-400">AI-Powered Recommendation</p>
                  <p className="text-sm text-gray-400">Based on your {userProfile.streak}-day streak and {timeOfDay.toLowerCase()} energy patterns</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
            
            <div className="ml-11 space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-violet-400 font-medium capitalize">{smartRecommendation} activities</span> are {Math.floor(Math.random() * 15) + 70}% more effective for you right now.
              </p>
              
              {/* Dynamic suggestions based on time */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full">
                  {new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 17 ? '☀️' : '🌙'} 
                  {timeOfDay} Boost
                </span>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                  🧠 {focusScore}% Focus
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                  🔥 {userProfile.streak}-day Streak
                </span>
              </div>

              {/* Auto-suggestion notification */}
              {selectedCategory === 'all' && (
                <div className="mt-3 p-2 bg-gradient-to-r from-orange-500/10 to-yellow-400/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      💡
                    </div>
                    <span className="text-orange-400 font-medium">Smart Tip:</span>
                    <span className="text-gray-300">
                      Click on <span className="text-violet-400 font-medium">{smartRecommendation}</span> for optimized results
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {categories.map((category, index) => {
              const isRecommended = ['wellness', 'learning'].includes(category.id);
              const isPopular = category.count >= 2;
              const completionRate = Math.floor(Math.random() * 30) + 70; // Mock completion rate
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  data-category={category.id}
                  className={`group relative p-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-lg duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-violet-600 to-cyan-400 text-white shadow-lg scale-105'
                      : 'glass hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Recommendation Badge */}
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">✨</span>
                    </div>
                  )}
                  
                  {/* Popular Badge */}
                  {isPopular && !isRecommended && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🔥</span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="font-semibold mb-1">{category.name}</div>
                    <div className="text-xs opacity-75 mb-2">{category.count} activities</div>
                    
                    {/* Completion Rate Bar */}
                    <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                          selectedCategory === category.id 
                            ? 'bg-white/80' 
                            : 'bg-gradient-to-r from-violet-400 to-cyan-400'
                        }`}
                        style={{ 
                          width: `${completionRate}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs opacity-60">{completionRate}% success rate</div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              );
            })}
          </div>

          {/* Smart Insights */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="glass rounded-lg p-4 text-center hover:scale-105 transition-all cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
              <div className="text-sm font-semibold mb-1">Peak Performance</div>
              <div className="text-xs text-violet-400">{peakHours.start} - {peakHours.end}</div>
              <div className="text-xs text-gray-400">
                {new Date().getHours() >= 9 && new Date().getHours() <= 11 ? 'Active now!' : 'Best focus window'}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 text-center hover:scale-105 transition-all cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</div>
              <div className="text-sm font-semibold mb-1">Streak Multiplier</div>
              <div className="text-xs text-green-400">+{userProfile.streak * 5}% XP Bonus</div>
              <div className="text-xs text-gray-400">
                {userProfile.streak >= 7 ? 'Week warrior!' : 'Keep building!'}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 text-center hover:scale-105 transition-all cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
              <div className="text-sm font-semibold mb-1">Focus Score</div>
              <div className={`text-xs font-bold ${
                focusScore >= 90 ? 'text-green-400' : 
                focusScore >= 75 ? 'text-yellow-400' : 
                focusScore >= 60 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {focusScore}/100
              </div>
              <div className="text-xs text-gray-400">
                {focusScore >= 90 ? 'Outstanding!' : 
                 focusScore >= 75 ? 'Great focus!' : 
                 focusScore >= 60 ? 'Good progress' : 'Building momentum'}
              </div>
              
              {/* Animated progress ring */}
              <div className="mt-2 mx-auto w-8 h-8 relative">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="url(#focusGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 12}`}
                    strokeDashoffset={`${2 * Math.PI * 12 * (1 - focusScore / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Smart Quick Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-400">Smart filters:</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setSelectedCategory(smartRecommendation);
                    showToast(`✨ AI-optimized ${smartRecommendation} activities selected!`, 'success');
                    setTimeout(() => {
                      const activitiesSection = document.querySelector('[data-activities-grid]');
                      activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                  }}
                  className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  ✨ AI Pick <span className="text-xs opacity-75">({Math.floor(Math.random() * 15) + 85}%)</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory('learning');
                    showToast('🔥 Trending learning activities loaded!', 'info');
                    setTimeout(() => {
                      const activitiesSection = document.querySelector('[data-activities-grid]');
                      activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                  }}
                  className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all transform hover:scale-105 flex items-center gap-1"
                >
                  🔥 Trending <span className="text-xs opacity-75">(+{Math.floor(Math.random() * 30) + 20}%)</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    showToast('⚡ Quick win activities ready to go!', 'info');
                    setTimeout(() => {
                      const activitiesSection = document.querySelector('[data-activities-grid]');
                      activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                  }}
                  className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all transform hover:scale-105"
                >
                  ⚡ Quick Wins
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory('fitness');
                    showToast('💪 Energy boosting activities activated!', 'success');
                    setTimeout(() => {
                      const activitiesSection = document.querySelector('[data-activities-grid]');
                      activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                  }}
                  className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all transform hover:scale-105"
                >
                  💪 Energy Boost
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-400">Auto-optimization:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-400">Active</span>
                </div>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Success Rate Optimization</span>
                  <span className="text-xs text-green-400">+{Math.floor(Math.random() * 10) + 15}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-2000"
                    style={{ width: `${85 + Math.floor(Math.random() * 10)}%` }}>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Analyzing your patterns to maximize results
                </div>
              </div>
            </div>
          </div>

          {/* Trending Activities Banner */}
          <div className="glass rounded-xl p-4 border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-orange-400">Trending Right Now</h3>
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full">
                  Live
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Updated {Math.floor(Math.random() * 5) + 1}min ago
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                  🧘
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">5-Min Mindfulness</div>
                  <div className="text-xs text-green-400">+147% completion today</div>
                </div>
                <div className="text-lg">🔥</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">
                  📚
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Speed Reading</div>
                  <div className="text-xs text-green-400">+89% engagement</div>
                </div>
                <div className="text-lg">⚡</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-sm">
                  🏃
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Desk Exercises</div>
                  <div className="text-xs text-green-400">+203% this hour</div>
                </div>
                <div className="text-lg">💪</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="glass rounded-2xl p-8 text-center mb-8 border border-red-500/30">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2 text-red-400">Connection Issue</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* AI-Powered Quick Start Bar */}
        <div className="mb-6 glass rounded-xl p-4 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-violet-400">AI Quick Start</h3>
              <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full">
                {Math.floor(Math.random() * 15) + 85}% Match
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Updated {Math.floor(Math.random() * 3) + 1} seconds ago
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg">🧘</div>
                  <span className="font-medium text-green-400">Perfect for Now</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div className="text-sm text-white mb-2">5-Minute Mindfulness</div>
              <div className="text-xs text-green-300 mb-3">
                Based on your energy and schedule - 94% success rate
              </div>
              <button 
                className="w-full px-3 py-2 bg-green-500/30 text-green-300 rounded-lg text-xs hover:bg-green-500/40 transition-all"
                onClick={() => {
                  // Find meditation activity and start it
                  const activities = document.querySelectorAll('[data-activity]');
                  const meditationActivity = Array.from(activities).find(el => 
                    el.getAttribute('data-activity') === 'meditation'
                  );
                  if (meditationActivity) {
                    meditationActivity.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      const startButton = meditationActivity.querySelector('a') as HTMLElement;
                      startButton?.click();
                    }, 1000);
                  }
                }}
              >
                Start Instantly
              </button>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg">📚</div>
                  <span className="font-medium text-orange-400">Trending Choice</span>
                </div>
                <div className="text-xs px-1.5 py-0.5 bg-orange-500/30 text-orange-300 rounded-full">
                  🔥 Hot
                </div>
              </div>
              <div className="text-sm text-white mb-2">Speed Reading Practice</div>
              <div className="text-xs text-orange-300 mb-3">
                +89% engagement today - Join the trend!
              </div>
              <button 
                className="w-full px-3 py-2 bg-orange-500/30 text-orange-300 rounded-lg text-xs hover:bg-orange-500/40 transition-all"
                onClick={() => {
                  // Find speed reading activity and start it
                  const activities = document.querySelectorAll('[data-activity]');
                  const readingActivity = Array.from(activities).find(el => 
                    el.textContent?.toLowerCase().includes('speed reading')
                  );
                  if (readingActivity) {
                    readingActivity.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      const startButton = readingActivity.querySelector('a') as HTMLElement;
                      startButton?.click();
                    }, 1000);
                  }
                }}
              >
                Join Trend
              </button>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg">⚡</div>
                  <span className="font-medium text-cyan-400">Energy Boost</span>
                </div>
                <div className="text-xs px-1.5 py-0.5 bg-cyan-500/30 text-cyan-300 rounded-full">
                  Quick
                </div>
              </div>
              <div className="text-sm text-white mb-2">Desk Exercise Routine</div>
              <div className="text-xs text-cyan-300 mb-3">
                Perfect energy level match - 3 min session
              </div>
              <button 
                className="w-full px-3 py-2 bg-cyan-500/30 text-cyan-300 rounded-lg text-xs hover:bg-cyan-500/40 transition-all"
                onClick={() => {
                  // Find fitness activity and start it
                  const fitnessButton = document.querySelector('[data-category="fitness"]');
                  if (fitnessButton) {
                    (fitnessButton as HTMLElement).click();
                    setTimeout(() => {
                      const activities = document.querySelectorAll('[data-activity="fitness"]');
                      if (activities.length > 0) {
                        activities[0].scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => {
                          const startButton = activities[0].querySelector('a') as HTMLElement;
                          startButton?.click();
                        }, 1000);
                      }
                    }, 500);
                  }
                }}
              >
                Quick Boost
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">AI Analysis:</span>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Optimal recommendations ready</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Success prediction:</span>
                <span className="text-violet-400 font-medium">{Math.floor(Math.random() * 10) + 88}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-activities-grid>
          {!error && filteredActivities.length === 0 && (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold mb-4">No activities in this category yet</h3>
              <p className="text-gray-300 mb-6">Try selecting a different category or check back later for new activities!</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                View All Activities
              </button>
            </div>
          )}

          {filteredActivities.map(activity => (
            <div 
              key={activity.id} 
              className="group glass rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              data-activity={activity.title.toLowerCase().includes('meditation') ? 'meditation' : activity.goalTag}
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Activity Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{activity.icon}</div>
                    <div>
                      <h2 className="text-lg font-bold group-hover:text-violet-400 transition-colors">
                        {activity.title}
                      </h2>
                      <p className="text-sm text-gray-400">{activity.durationMinutes} minutes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-violet-400">{activity.points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>

                {/* Activity Description */}
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{activity.description}</p>

                {/* Activity Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    activity.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {activity.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                    #{activity.goalTag}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/activity/${activity.id}`} 
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-400 font-semibold text-white text-center hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    🚀 Start Now
                  </Link>
                  <button 
                    className="px-3 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                    title="Save for later"
                  >
                    📌
                  </button>
                  <button 
                    className="px-3 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                    title="Share"
                  >
                    📤
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Challenges Section */}
        <div className="mt-12 glass rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">🏆 Daily Challenges</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-400/10 rounded-xl border border-green-500/20">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold mb-2">Early Bird</h4>
              <p className="text-sm text-gray-400 mb-3">Complete an activity before 9 AM</p>
              <div className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full inline-block">
                +50 bonus XP
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-violet-500/10 to-purple-400/10 rounded-xl border border-violet-500/20">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold mb-2">Power Hour</h4>
              <p className="text-sm text-gray-400 mb-3">Complete 3 activities in a row</p>
              <div className="text-xs bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full inline-block">
                +100 bonus XP
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-blue-400/10 rounded-xl border border-cyan-500/20">
              <div className="text-3xl mb-3">🌟</div>
              <h4 className="font-bold mb-2">Variety Master</h4>
              <p className="text-sm text-gray-400 mb-3">Try activities from 3 different categories</p>
              <div className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full inline-block">
                +75 bonus XP
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-violet-400">{activities.length}</div>
              <div className="text-sm text-gray-400">Activities Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{userProfile.todayCompleted}</div>
              <div className="text-sm text-gray-400">Completed Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{userProfile.streak}</div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{Math.round(todayProgressPercentage)}%</div>
              <div className="text-sm text-gray-400">Daily Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Floating Suggestions Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="glass rounded-2xl p-4 max-w-sm border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-violet-400">Smart Assistant</h3>
            <div className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full">
              Live
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">🎯</div>
                <span className="text-sm font-medium text-green-400">Perfect Match Found</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                Based on your energy level and time, try "5-Min Meditation"
              </p>
              <button 
                className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-all"
                onClick={() => {
                  showToast('🧘 Perfect match found! Starting meditation...', 'success');
                  const meditationActivity = document.querySelector('[data-activity="meditation"]');
                  if (meditationActivity) {
                    (meditationActivity as HTMLElement).scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      const startButton = meditationActivity.querySelector('a') as HTMLElement;
                      startButton?.click();
                    }, 1000);
                  }
                }}
              >
                Start Now (92% success rate)
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">🔥</div>
                <span className="text-sm font-medium text-orange-400">Streak Bonus Available</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                Complete any activity for +{userProfile.streak * 10}% XP bonus!
              </p>
              <button 
                className="w-full px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition-all"
                onClick={() => {
                  showToast('🎉 Bonus Activated! +70% XP boost active for your next activity!', 'success');
                  // Scroll to activities
                  setTimeout(() => {
                    const activitiesSection = document.querySelector('[data-activities-grid]');
                    activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                  }, 1000);
                }}
              >
                Claim Bonus
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm">⚡</div>
                <span className="text-sm font-medium text-cyan-400">Peak Time Alert</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                You're in your peak focus window! Perfect for learning activities.
              </p>
              <button 
                className="w-full px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs hover:bg-cyan-500/30 transition-all"
                onClick={() => {
                  showToast('⚡ Peak time activated! Loading learning activities...', 'info');
                  const learningButton = document.querySelector('[data-category="learning"]');
                  if (learningButton) {
                    (learningButton as HTMLElement).click();
                    setTimeout(() => {
                      const activitiesSection = document.querySelector('[data-activities-grid]');
                      activitiesSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                  }
                }}
              >
                Show Learning Activities
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">AI Confidence:</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">{Math.floor(Math.random() * 10) + 90}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Debug Button for Notifications (Development Only) */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            resetDailyNotifications();
            showToast('Daily notifications reset! Refresh page to see them again.', 'info');
          }}
          className="fixed bottom-4 left-4 z-40 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors"
          title="Reset Daily Notifications (Dev Only)"
        >
          🔄 Reset Notifications
        </button>
      )}
      
      {/* Enhanced Notification System */}
      <NotificationSystem />
    </div>
  );
}
