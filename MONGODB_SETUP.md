# MongoDB Setup Instructions

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service (check the box during installation)
4. MongoDB will start automatically

### Start MongoDB Service:
```bash
net start MongoDB
```

### Stop MongoDB Service:
```bash
net stop MongoDB
```

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/attendance?retryWrites=true&w=majority
   ```

## After MongoDB is Running:

### 1. Seed the Database:
```bash
cd backend
node seed.js
```

### 2. Start Backend Server:
```bash
cd backend
npm start
```

### 3. Start Frontend (Already Running):
```bash
cd frontend
npm run dev
```

## Access the Application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Current Status:
✅ Frontend is running on http://localhost:5173
❌ Backend needs MongoDB to be installed/configured
