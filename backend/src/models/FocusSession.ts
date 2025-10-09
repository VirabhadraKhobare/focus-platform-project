import mongoose from 'mongoose';
const FocusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomId: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('FocusSession', FocusSchema);
