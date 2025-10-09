import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  points: { type: Number, default: 0 },
  streak: {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastActive: Date
  },
  savedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', UserSchema);
