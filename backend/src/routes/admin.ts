import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin-secret-123';

// Admin authentication middleware
const adminAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Admin token required' });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid admin token' });
  }
};

// Admin login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      res.status(500).json({ message: 'Admin credentials not configured' });
      return;
    }

    if (email !== adminEmail) {
      res.status(401).json({ message: 'Invalid admin credentials' });
      return;
    }

    // In production, you should hash the admin password
    if (password !== adminPassword) {
      res.status(401).json({ message: 'Invalid admin credentials' });
      return;
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      ADMIN_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: { email: adminEmail, role: 'admin' }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    let users = [];

    if (global.isMongoConnected) {
      // MongoDB users
      const User = require('../models/User').default;
      users = await User.find({}, '-passwordHash').sort({ createdAt: -1 }).lean();
    } else {
      // In-memory users
      users = global.inMemoryUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        streak: user.streak || 0,
        createdAt: user.createdAt || new Date(),
        lastLogin: user.lastLogin
      }));
    }

    res.json({
      total: users.length,
      users: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get admin activity logs
router.get('/logs', adminAuth, (req, res) => {
  try {
    const logs = global.adminLogs || [];
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const type = req.query.type as string;

    let filteredLogs = logs;
    
    if (type) {
      filteredLogs = logs.filter(log => log.type === type);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    res.json({
      total: filteredLogs.length,
      page,
      limit,
      logs: paginatedLogs
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// Get dashboard statistics
router.get('/stats', adminAuth, (req, res) => {
  try {
    const logs = global.adminLogs || [];
    const users = global.inMemoryUsers || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalUsers: users.length,
      todayRegistrations: logs.filter(log => 
        log.type === 'registration' && 
        new Date(log.timestamp) >= today
      ).length,
      todayLogins: logs.filter(log => 
        log.type === 'login' && 
        new Date(log.timestamp) >= today
      ).length,
      todayActivities: logs.filter(log => 
        log.type === 'activity' && 
        new Date(log.timestamp) >= today
      ).length,
      todayErrors: logs.filter(log => 
        log.type === 'error' && 
        new Date(log.timestamp) >= today
      ).length,
      recentActivity: logs.slice(0, 10)
    };

    res.json(stats);

  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ message: 'Failed to generate statistics' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (global.isMongoConnected) {
      const User = require('../models/User').default;
      await User.findByIdAndDelete(userId);
    } else {
      const userIndex = global.inMemoryUsers.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        global.inMemoryUsers.splice(userIndex, 1);
      }
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Send test notification
router.post('/test-notification', adminAuth, async (req, res) => {
  try {
    const { adminNotifier } = require('../services/AdminNotificationService');
    
    await adminNotifier.sendNotification({
      type: 'error',
      error: {
        message: 'Test notification from admin panel'
      },
      timestamp: new Date(),
      user: { email: 'admin@test.com', name: 'Admin', id: 'admin' }
    });

    res.json({ message: 'Test notification sent successfully' });

  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: 'Failed to send test notification' });
  }
});

export default router;