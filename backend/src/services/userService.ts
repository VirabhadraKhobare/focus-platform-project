import User from '../models/User';

// Import in-memory storage arrays from main server
declare global {
  var inMemoryUsers: any[];
  var inMemorySessions: any[];
  var isMongoConnected: boolean;
}

const USE_MONGODB = process.env.USE_MONGODB !== 'false' && global.isMongoConnected;

export const userService = {
  async findById(id: string) {
    if (USE_MONGODB && global.isMongoConnected) {
      return await User.findById(id);
    } else {
      return global.inMemoryUsers.find(u => u.id === id || u._id === id);
    }
  },

  async findByEmail(email: string) {
    if (USE_MONGODB && global.isMongoConnected) {
      return await User.findOne({ email });
    } else {
      return global.inMemoryUsers.find(u => u.email === email);
    }
  },

  async create(userData: any) {
    if (USE_MONGODB && global.isMongoConnected) {
      return await User.create(userData);
    } else {
      const userId = Date.now().toString();
      const user = {
        _id: userId,
        id: userId,
        ...userData,
        createdAt: new Date()
      };
      global.inMemoryUsers.push(user);
      return user;
    }
  }
};