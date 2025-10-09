import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface OnboardingFlowProps {
  onComplete: () => void;
  userName: string;
}

export default function OnboardingFlow({ onComplete, userName }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const steps = [
    {
      title: `Welcome to FocusFlow, ${userName}! 🎉`,
      subtitle: 'Let\'s get you started on your journey to better habits',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🚀</div>
          <p className="text-lg text-gray-300">
            You're about to transform your daily routine with focused, meaningful activities.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-semibold">Daily Activities</div>
              <div className="text-xs text-gray-400">Curated focus sessions</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-semibold">Smart Timer</div>
              <div className="text-xs text-gray-400">Track your progress</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-semibold">Achievements</div>
              <div className="text-xs text-gray-400">Build streaks & earn points</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'What are your goals? 🎯',
      subtitle: 'Select areas you\'d like to focus on (choose any that interest you)',
      content: (
        <div className="space-y-4">
          {[
            { id: 'wellness', icon: '🧘‍♀️', title: 'Wellness & Mindfulness', desc: 'Meditation, breathing, self-care' },
            { id: 'learning', icon: '📚', title: 'Learning & Growth', desc: 'Reading, skills, knowledge' },
            { id: 'creativity', icon: '🎨', title: 'Creativity & Expression', desc: 'Writing, art, creative projects' },
            { id: 'fitness', icon: '💪', title: 'Health & Fitness', desc: 'Exercise, movement, nutrition' },
            { id: 'productivity', icon: '⚡', title: 'Productivity & Focus', desc: 'Work, organization, efficiency' },
            { id: 'social', icon: '👥', title: 'Relationships & Social', desc: 'Connection, communication, community' }
          ].map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                if (selectedGoals.includes(goal.id)) {
                  setSelectedGoals(prev => prev.filter(g => g !== goal.id));
                } else {
                  setSelectedGoals(prev => [...prev, goal.id]);
                }
              }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedGoals.includes(goal.id)
                  ? 'bg-gradient-to-r from-violet-600/20 to-cyan-400/20 border-violet-500/50'
                  : 'glass border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{goal.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold">{goal.title}</div>
                  <div className="text-sm text-gray-400">{goal.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selectedGoals.includes(goal.id)
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-gray-400'
                }`}>
                  {selectedGoals.includes(goal.id) && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'You\'re all set! 🌟',
      subtitle: 'Your FocusFlow journey begins now',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🎊</div>
          <p className="text-lg text-gray-300">
            Congratulations! You've completed the setup and earned your first <span className="text-violet-400 font-semibold">100 bonus points</span>!
          </p>
          <div className="glass rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold">What's next?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <span>Browse your personalized daily activities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <span>Start with a 5-minute activity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <span>Use the smart timer to stay focused</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <span>Build your streak and earn achievements!</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-semibold">🎁 Welcome bonus unlocked!</p>
            <p className="text-sm text-gray-300">100 points + Premium activities for 7 days</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user preferences and complete onboarding
      localStorage.setItem('focusflow_goals', JSON.stringify(selectedGoals));
      localStorage.setItem('focusflow_onboarded', 'true');
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-violet-500/10 rounded-full animate-pulse float-animation"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-cyan-400/10 rounded-full animate-pulse delay-1000 float-animation"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-violet-600/10 rounded-full animate-pulse delay-2000 float-animation"></div>
      </div>

      <div className="max-w-2xl mx-auto p-6 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-600 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentStepData.title}</h1>
            <p className="text-gray-400">{currentStepData.subtitle}</p>
          </div>
          
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index <= currentStep ? 'bg-violet-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === 1 && selectedGoals.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {currentStep === steps.length - 1 ? '🚀 Start Journey' : 'Next →'}
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Skip setup for now
          </button>
        </div>
      </div>
    </div>
  );
}