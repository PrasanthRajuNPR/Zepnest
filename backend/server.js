require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
// CORS — allow credentials from frontends
app.use(cors({
  origin: [
    process.env.USER_UI_URL || 'http://localhost:3000',
    process.env.ADMIN_UI_URL || 'http://localhost:3001',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zepnest API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Zepnest API running on port ${PORT}`);
  });
});
