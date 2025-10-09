import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FloatingActionButtonProps {
  className?: string;
}

export default function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action Menu */}
      <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/daily"
            className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">🎯</span>
            <span className="font-medium">Start Activity</span>
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">📊</span>
            <span className="font-medium">View Stats</span>
          </Link>
          
          <button
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => {
              // Mock share functionality
              navigator.clipboard?.writeText('Check out FocusFlow! Transform your daily habits with focused activities.');
              alert('Link copied to clipboard!');
              setIsOpen(false);
            }}
          >
            <span className="text-lg">📤</span>
            <span className="font-medium">Share App</span>
          </button>
        </div>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center text-white text-xl font-bold glow-effect ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? '✕' : '+'}
      </button>
      
      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 opacity-20 animate-ping"></div>
    </div>
  );
}