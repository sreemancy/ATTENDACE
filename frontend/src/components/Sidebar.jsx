import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ user, onLogout }){
  const linkClass = ({ isActive }) => 
    `block py-3 px-4 rounded-lg mb-2 transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white h-screen p-6 border-r shadow-sm flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-blue-600">Attendance</h2>
      <nav className="flex-1">
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/attendance" className={linkClass}>
          ✏️ Add Attendance
        </NavLink>
        <NavLink to="/students" className={linkClass}>
          👥 Students
        </NavLink>
      </nav>
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-2">Welcome, {user?.name}</div>
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
