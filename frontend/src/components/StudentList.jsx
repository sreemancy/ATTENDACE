import React, {useEffect, useState} from 'react';
import api from '../api/api';

export default function StudentList(){
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', rollNumber: '', email: '', phone: '', address: ''
  });

  const loadStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', formData);
      setFormData({ name: '', rollNumber: '', email: '', phone: '', address: '' });
      setShowForm(false);
      loadStudents();
      alert('Student added successfully!');
    } catch (err) {
      console.error('Error adding student:', err);
      // Prefer backend structured error details when available
      const details = err.response?.data?.details;
      const backendMsg = err.response?.data?.error || err.response?.data || err.message;
      const errorMsg = details ? JSON.stringify(details) : backendMsg || 'Unknown error';
      alert(`Error adding student: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
      alert('Student deleted successfully!');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Error deleting student');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Students</h2>
        <button 
          onClick={()=>setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Name" 
              value={formData.name}
              onChange={e=>setFormData({...formData, name: e.target.value})}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Roll Number" 
              value={formData.rollNumber}
              onChange={e=>setFormData({...formData, rollNumber: e.target.value})}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Email" 
              type="email"
              value={formData.email}
              onChange={e=>setFormData({...formData, email: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Phone" 
              value={formData.phone}
              onChange={e=>setFormData({...formData, phone: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Address" 
              value={formData.address}
              onChange={e=>setFormData({...formData, address: e.target.value})}
              className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors"
            >
              Add Student
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Roll Number</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Phone</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4">{s.rollNumber}</td>
                <td className="px-6 py-4">{s.email || '-'}</td>
                <td className="px-6 py-4">{s.phone || '-'}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={()=>handleDelete(s._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
