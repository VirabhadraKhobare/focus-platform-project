import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show loading/redirect message while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Redirecting to your dashboard...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <Link to="/dashboard" className="text-violet-400 underline">Click here if not redirected</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
                FocusFlow
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-violet-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-violet-600/10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-500/10 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="max-w-6xl w-full relative z-10">
          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              FocusFlow
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Transform mindless scrolling into mindful action. Build powerful habits, 
              join focus communities, and reclaim your most valuable asset: <span className="text-violet-400 font-semibold">time</span>.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Join thousands who've already transformed their daily routines ✨
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Daily Activities</h3>
              <p className="text-gray-400 text-sm">Curated focus sessions designed to build momentum</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 delay-100">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Smart Timer</h3>
              <p className="text-gray-400 text-sm">Visual progress tracking with celebration rewards</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 delay-200">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Gamification</h3>
              <p className="text-gray-400 text-sm">Earn points, build streaks, and compete with friends</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 min-w-[200px] text-center"
            >
              🚀 Start Free Today
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 border-2 border-white/20 rounded-xl text-gray-300 hover:bg-white/5 transition-all font-semibold transform hover:scale-105 min-w-[200px] text-center"
            >
              🔑 Sign In
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">Trusted by focused individuals worldwide</p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>15,000+ Activities Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>800+ Focus Hours Logged</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                <span>92% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            Why FocusFlow Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Science-Backed Approach</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Micro-Habits</h4>
                    <p className="text-gray-400">Small actions compound into life-changing results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Progress Tracking</h4>
                    <p className="text-gray-400">Visual feedback keeps you motivated and engaged</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👥</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Community Power</h4>
                    <p className="text-gray-400">Accountability through shared focus sessions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-4">Your Journey Starts Here</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <span>Sign up and set your goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <span>Choose your first 5-minute activity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <span>Use the smart timer to stay focused</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <span>Celebrate your progress and build streaks</span>
                </div>
              </div>
              <Link 
                to="/register"
                className="block mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold text-center hover:shadow-lg transition-all transform hover:scale-105"
              >
                Begin Your Journey →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            FocusFlow
          </h3>
          <p className="text-gray-400 mb-6">Transform your daily habits with focused activities</p>
          <div className="flex justify-center gap-8">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm">© 2025 FocusFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}