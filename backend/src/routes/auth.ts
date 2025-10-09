import { Router } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { adminNotifier } from '../services/AdminNotificationService';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = '1h';

// Import in-memory storage arrays from main server
declare global {
  var inMemoryUsers: any[];
  var inMemorySessions: any[];
  var isMongoConnected: boolean;
}

const USE_MONGODB = process.env.USE_MONGODB !== 'false' && global.isMongoConnected;

// Initialize global arrays if they don't exist
if (!global.inMemoryUsers) global.inMemoryUsers = [];
if (!global.inMemorySessions) global.inMemorySessions = [];

router.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if(!email || !password) {
      res.status(400).json({message:'email & password required'});
      return;
    }
    
    // Check if using MongoDB or in-memory storage
    if (USE_MONGODB && global.isMongoConnected) {
      // MongoDB path
      const existing = await User.findOne({ email });
      if(existing) {
        res.status(400).json({message:'User exists'});
        return;
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash: hash });
      const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      
      // Send admin notification
      // await adminNotifier.sendNotification({
      //   type: 'registration',
      //   user: { id: user._id.toString(), name, email },
      //   timestamp: new Date(),
      //   ip: req.ip,
      //   userAgent: req.get('User-Agent')
      // });
      
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // In-memory storage path
      console.log('🗄️ Using in-memory storage for registration');
      const existing = global.inMemoryUsers.find(u => u.email === email);
      if(existing) {
        res.status(400).json({message:'User exists'});
        return;
      }
      
      const hash = await bcrypt.hash(password, 10);
      const userId = Date.now().toString(); // Simple ID generation
      const user = { 
        _id: userId, 
        id: userId,
        name, 
        email, 
        passwordHash: hash,
        createdAt: new Date()
      };
      
      global.inMemoryUsers.push(user);
      const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      
      // Send admin notification
      // await adminNotifier.sendNotification({
      //   type: 'registration',
      //   user: { id: userId, name, email },
      //   timestamp: new Date(),
      //   ip: req.ip,
      //   userAgent: req.get('User-Agent')
      // });
      
      console.log(`✅ User registered in memory: ${email}`);
      res.json({ token, user: { id: userId, name, email } });
    }
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if using MongoDB or in-memory storage
    if (USE_MONGODB && global.isMongoConnected) {
      // MongoDB path
      const user = await User.findOne({ email });
      if(!user) {
        res.status(401).json({message:'Invalid'});
        return;
      }
      const ok = await bcrypt.compare(password, user.passwordHash || '');
      if(!ok) {
        res.status(401).json({message:'Invalid'});
        return;
      }
      const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      
      // Send admin notification
      // await adminNotifier.sendNotification({
      //   type: 'login',
      //   user: { id: user._id.toString(), name: user.name || 'Unknown', email: user.email },
      //   timestamp: new Date(),
      //   ip: req.ip,
      //   userAgent: req.get('User-Agent')
      // });
      
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // In-memory storage path
      console.log('🗄️ Using in-memory storage for login');
      const user = global.inMemoryUsers.find(u => u.email === email);
      if(!user) {
        res.status(401).json({message:'Invalid'});
        return;
      }
      
      const ok = await bcrypt.compare(password, user.passwordHash || '');
      if(!ok) {
        res.status(401).json({message:'Invalid'});
        return;
      }
      
      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      
      // Send admin notification
      // await adminNotifier.sendNotification({
      //   type: 'login',
      //   user: { id: user.id, name: user.name, email: user.email },
      //   timestamp: new Date(),
      //   ip: req.ip,
      //   userAgent: req.get('User-Agent')
      // });
      
      console.log(`✅ User logged in from memory: ${email}`);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
