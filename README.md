# Student Attendance Tracker

A full-stack MERN application for tracking student attendance with a responsive UI.

## Features

- 📊 Dashboard with attendance statistics
- ✏️ Mark daily attendance (Present, Late, Undertime, Absent)
- 👥 Student management (CRUD operations)
- 📈 Attendance rate calculation
- 🎨 Clean UI with Tailwind CSS

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/attendance
# JWT_SECRET=your-secret-key

# Seed database (optional)
node seed.js

# Start server
npm start
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Students (Protected)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance (Protected)
- `POST /api/attendance` - Bulk add/update attendance
- `GET /api/attendance?month=12&year=2025` - Get attendance by month

### Batches (Protected)
- `GET /api/batches` - Get all batches
- `POST /api/batches` - Create batch

## Project Structure

```
attendance-tracker/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── controllers/     # Route controllers
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeder
└── frontend/
    └── src/
        ├── components/  # React components
        ├── api/         # Axios instance
        └── App.jsx      # Main app
```

## Usage

1. Start MongoDB
2. Run backend server
3. Seed database with default user: `node seed.js`
4. Run frontend dev server
5. Login with: admin@attendance.com / admin123
6. Navigate to Dashboard to view statistics
7. Use "Add Attendance" to mark daily attendance
8. Manage students in the Students section

## Authentication Features

- **Login**: Secure JWT-based authentication
- **Password Reset**: Request reset token via email (console in development)
- **Protected Routes**: All API endpoints require authentication
- **Auto-logout**: Automatic logout on token expiration

## License

MIT
