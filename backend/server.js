const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const studentsRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const batchesRoutes = require('./routes/batches');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Attendance Tracker API',
    endpoints: {
      test: '/api/test',
      auth: '/api/auth',
      students: '/api/students',
      attendance: '/api/attendance',
      batches: '/api/batches'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working with MongoDB' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/batches', batchesRoutes);

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === 'inmemory') {
      // Start an in-memory server only when no external URI is provided
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using MongoDB Memory Server (in-memory)');
    } else {
      console.log('Using MongoDB URI from environment');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
