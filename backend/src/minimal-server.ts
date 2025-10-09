import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Health endpoint called');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Test endpoint working' });
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on http://localhost:${PORT}`);
});