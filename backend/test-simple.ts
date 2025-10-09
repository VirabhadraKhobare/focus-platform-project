console.log('Testing backend startup...');

import express from 'express';
console.log('Express imported successfully');

import cors from 'cors';
console.log('CORS imported successfully');

import mongoose from 'mongoose';
console.log('Mongoose imported successfully');

const app = express();
console.log('Express app created');

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});