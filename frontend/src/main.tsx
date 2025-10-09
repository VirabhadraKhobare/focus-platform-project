import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import DailyFeed from './pages/DailyFeed';
import ActivityDetail from './pages/ActivityDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FocusRoom from './pages/FocusRoom';
import ProtectedRoute from './components/ProtectedRoute';

console.log('React app is starting...');

function App(){
  console.log('App component is rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          
          {/* Protected Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/daily' element={
            <ProtectedRoute>
              <DailyFeed/>
            </ProtectedRoute>
          }/>
          <Route path='/activity/:id' element={
            <ProtectedRoute>
              <ActivityDetail/>
            </ProtectedRoute>
          }/>
          <Route path='/focus-room' element={
            <ProtectedRoute>
              <FocusRoom/>
            </ProtectedRoute>
          }/>
          
          {/* Redirect old routes */}
          <Route path='/focus' element={<Navigate to="/focus-room" replace />}/>
          
          {/* Catch all route */}
          <Route path='*' element={<Navigate to="/" replace />}/>
        </Routes>
      </BrowserRouter>
  );
}

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (!rootElement) {
    console.error('Root element not found!');
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('Root created, rendering app...');
  
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </React.StrictMode>
  );
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Error rendering app:', error);
}
