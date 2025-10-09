import mongoose from 'mongoose';
const ActivitySchema = new mongoose.Schema({
  title: String,
  description: String,
  durationMinutes: Number,
  goalTag: String,
  difficulty: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Activity', ActivitySchema);
