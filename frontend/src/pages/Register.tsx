import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      nav('/dashboard');
    }
  }, [isAuthenticated, nav]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      nav('/dashboard');
    } catch (err: any) {
      console.error('Register error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.isNetworkError || err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network Error: Cannot connect to server. Please check if the backend is running on port 4000.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-violet-500/10 rounded-full animate-pulse float-animation"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-cyan-400/10 rounded-full animate-pulse delay-1000 float-animation"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-violet-600/10 rounded-full animate-pulse delay-2000 float-animation"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-cyan-500/10 rounded-full animate-pulse delay-500 float-animation"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md relative z-10">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p className="text-xl text-gray-300 mb-2">Join the journey!</p>
            <p className="text-gray-400">Start building better habits today</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
            
            {/* Benefits Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-lg border border-green-500/30">
              <div className="text-center">
                <p className="text-sm font-medium text-green-400 mb-1">🎁 Welcome Bonus</p>
                <p className="text-xs text-gray-400">Get 100 points + 5 bonus activities on signup!</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">At least 6 characters long</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                '🎉 Create Account'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

            {/* What You'll Get */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 text-center mb-4">What you'll get:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400">
                    ✓
                  </div>
                  <div className="text-sm text-gray-300">Personalized daily activities</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400">
                    ✓
                  </div>
                  <div className="text-sm text-gray-300">Progress tracking & achievements</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400">
                    ✓
                  </div>
                  <div className="text-sm text-gray-300">Community leaderboard</div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
