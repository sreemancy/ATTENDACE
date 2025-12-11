import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AttendanceForm from './components/AttendanceForm';
import StudentList from './components/StudentList';
// Removed login imports

function App() {
  // Bypass login - set default user
  const [user, setUser] = useState({ id: '1', email: 'admin@attendance.com', name: 'Admin User' });

  const handleLogout = () => {
    // Keep user logged in - do nothing
  };

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<AttendanceForm />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
