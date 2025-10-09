# 🎯 FocusFlow - Focus & Productivity Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

A modern, full-stack focus and productivity tracking application built with React, TypeScript, and Node.js. Help users build better habits, track their progress, and stay motivated with gamified productivity features.

## 🌟 Features

### 🔐 User Management
- **Secure Authentication**: JWT-based registration and login system
- **User Profiles**: Personal dashboard with stats and progress tracking
- **Welcome Bonus**: New users receive 100 points and bonus activities

### 📋 Activity Management  
- **Curated Activities**: Pre-built focus activities (meditation, reading, writing)
- **Activity Completion**: Track and complete daily productivity tasks
- **Progress Tracking**: Monitor streaks, points, and completion rates
- **Difficulty Levels**: Activities categorized by difficulty (Easy, Medium, Hard)

### 🏆 Gamification
- **Points System**: Earn points for completing activities
- **Leaderboards**: Compete with other users
- **Streaks**: Track consecutive days of activity completion
- **Achievement System**: Unlock rewards and milestones

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Theme**: Beautiful gradient-based dark interface
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Tailwind CSS**: Modern, utility-first styling approach

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast development and build process
- **Tailwind CSS** for responsive, modern styling
- **React Router** for seamless navigation
- **Axios** for API communication with interceptors and error handling

### Backend
- **Node.js** with Express.js for robust server-side logic
- **TypeScript** for type-safe backend development
- **JWT** for secure authentication
- **CORS** properly configured for cross-origin requests
- **Comprehensive Error Handling** with detailed logging

### Development Tools
- **ESLint & Prettier** for code quality
- **Nodemon** for backend hot-reloading
- **Docker** configuration for containerized deployment
- **Git Hooks** for automated testing and linting

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**
- **Git** for version control

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/VirabhadraKhobare/focus-platform-project.git
cd focus-platform-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Start Development Servers

#### Option A: Manual Start (Recommended)
```bash
# Terminal 1 - Backend Server
cd backend
node stable-backend.js

# Terminal 2 - Frontend Server  
cd frontend
npm run dev
```

#### Option B: Using Batch Scripts (Windows)
```bash
# Double-click these files:
start-backend-stable.bat
start-frontend-fixed.bat
```

### 3. Access the Application
- **Frontend**: http://localhost:5173 (or http://localhost:5174)
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

## 📱 Usage

### Registration & Login
1. Navigate to the registration page
2. Create an account with email and password
3. Receive welcome bonus of 100 points
4. Start completing activities immediately

### Activity Completion
1. Browse available activities on the dashboard
2. Select an activity to view details
3. Click "Start Activity" to begin focus session
4. Complete the activity to earn points and maintain streaks

### Progress Tracking
1. View your stats on the dashboard
2. Check the leaderboard to see your ranking
3. Track your daily streaks and total points
4. Monitor your productivity journey over time

## 🏗️ Project Structure

```
focus-platform-project/
├── backend/
│   ├── src/
│   │   ├── models/          # Data models (User, Activity, etc.)
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Authentication & validation
│   │   └── services/        # Business logic services
│   ├── stable-backend.js    # Production-ready server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components (Login, Dashboard, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API client and auth services
│   └── package.json
├── docs/
│   ├── CONNECTION_FIX.md   # Network troubleshooting guide
│   ├── REGISTRATION_FIX.md # Registration issues solutions
│   └── NETWORK_ERROR_FIXED.md # Latest fixes documentation
└── docker-compose.yml     # Container orchestration
```

## 🔧 Configuration

### Backend Configuration
The backend uses a stable configuration with comprehensive error handling:
- **Port**: 4000 (configurable via environment)
- **CORS**: Enabled for all origins in development
- **Logging**: Detailed request/response logging
- **Error Handling**: Graceful error responses with proper status codes

### Frontend Configuration
- **Vite Configuration**: Optimized for fast development
- **API Base URL**: Automatically detects backend port
- **Environment Variables**: Support for multiple environments
- **TypeScript**: Strict type checking enabled

## 🚨 Troubleshooting

### ✅ Issues Recently Fixed

#### "Network Error" during Registration - SOLVED ✅
- **Problem**: Users getting "Network Error" on registration
- **Solution**: Enhanced backend stability with `stable-backend.js`
- **Status**: Fully resolved - registration works perfectly

#### Backend Connection Issues - SOLVED ✅  
- **Problem**: Frontend couldn't connect to backend
- **Solution**: Fixed API configuration and CORS setup
- **Status**: Stable connection established

### Debug Mode
Enable verbose logging by checking the terminal outputs:
- Backend logs all incoming requests
- Frontend API calls are logged in browser console
- Health check endpoint available at `/health`

## 📄 Available Scripts

### Backend Scripts
```bash
node stable-backend.js   # Start stable production server
npm run dev             # Start with nodemon (hot reload)
npm run start           # Standard production start
npm run build           # Compile TypeScript
```

### Frontend Scripts  
```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 🧪 Testing

The project includes comprehensive testing for critical functionality:

### Registration & Authentication Testing
```bash
# Test registration endpoint
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Test login endpoint  
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### Health Check
```bash
# Check backend health
curl http://localhost:4000/health
```

## 📊 Recent Updates

### October 9, 2025 - Major Stability Update
- ✅ **Fixed Registration Errors**: Complete resolution of "Network Error" issues
- ✅ **Enhanced Backend**: New `stable-backend.js` with comprehensive error handling
- ✅ **Improved CORS**: Better cross-origin configuration
- ✅ **Better Logging**: Detailed request/response tracking
- ✅ **GitHub Integration**: Complete project uploaded to repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Database Integration**: MongoDB/PostgreSQL for persistent data
- [ ] **Real-time Features**: WebSocket integration for live updates
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Analytics**: Detailed productivity insights
- [ ] **Social Features**: Team challenges and collaboration
- [ ] **Integration APIs**: Connect with calendar and task management tools

## 📧 Support

If you encounter any issues:

1. Check the [troubleshooting guides](./NETWORK_ERROR_FIXED.md)
2. Review the [GitHub Issues](https://github.com/VirabhadraKhobare/focus-platform-project/issues)
3. Create a new issue with detailed information

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- Inspired by productivity and focus methodologies
- Design influenced by modern SaaS applications
- Community feedback and contributions welcomed

---

**⭐ Star this repository if you find it helpful!**

**🔗 [GitHub Repository](https://github.com/VirabhadraKhobare/focus-platform-project)** | **📖 [Documentation](./docs/)** | **🐛 [Report Bug](https://github.com/VirabhadraKhobare/focus-platform-project/issues)**