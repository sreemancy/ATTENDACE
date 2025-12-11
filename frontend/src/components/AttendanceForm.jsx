import React, {useEffect, useState} from 'react';
import api from '../api/api';

export default function AttendanceForm(){
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await api.get('/students');
        setStudents(data);
        const defaultMap = {};
        data.forEach(s => defaultMap[s._id] = 'present');
        setEntries(defaultMap);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleStatus = (id, status) => setEntries(prev=>({...prev, [id]: status}));

  const save = async () => {
    try {
      const payload = { 
        entries: Object.keys(entries).map(id => ({ 
          studentId: id, 
          date, 
          status: entries[id] 
        })) 
      };
      await api.post('/attendance', payload);
      alert('Attendance saved successfully!');
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Error saving attendance');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mark Attendance</h2>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Date:
        </label>
        <input 
          value={date} 
          onChange={e=>setDate(e.target.value)} 
          type="date" 
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Roll Number</th>
              <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4">{s.rollNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {['present','late','undertime','absent'].map(st => (
                      <button 
                        key={st} 
                        onClick={()=>toggleStatus(s._id, st)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          entries[s._id]===st 
                            ? st==='present' ? 'bg-green-600 text-white' 
                            : st==='late' ? 'bg-yellow-600 text-white'
                            : st==='undertime' ? 'bg-orange-600 text-white'
                            : 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors" 
          onClick={save}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}
