// backend/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Body parser middleware to accept JSON data
app.use(express.json());

// Enable CORS so our frontend can communicate with this backend
app.use(cors());

// --- API Routes ---
app.use('/api/teams', require('./routes/teams'));
app.use('/api/checkpoints', require('./routes/checkpoints'));
app.use('/api/submissions', require('./routes/submissions'));

// --- Make Uploads Folder Static ---
// This makes the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

if (process.env.NODE_ENV === 'production') {
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
);
} else {
app.get('/', (req, res) => {
  res.send('API is running...');
});
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
