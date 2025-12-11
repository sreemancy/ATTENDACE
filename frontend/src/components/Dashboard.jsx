import React, {useEffect, useState} from 'react';
import api from '../api/api';

export default function Dashboard(){
  const [summary, setSummary] = useState({ total:0, present:0, late:0, undertime:0, absent:0 });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      try {
        const now = new Date();
        const m = now.getMonth() + 1;
        const y = now.getFullYear();
        const { data } = await api.get(`/attendance?month=${m}&year=${y}`);
        
        const agg = { total:0, present:0, late:0, undertime:0, absent:0 };
        data.forEach(d => { 
          agg.total++; 
          agg[d.status] = (agg[d.status]||0)+1; 
        });
        setSummary(agg);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Attendance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="text-5xl font-bold mb-2">{summary.total}</div>
          <div className="text-blue-100 text-sm uppercase tracking-wide">Total Records</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="text-5xl font-bold mb-2">{summary.present}</div>
          <div className="text-green-100 text-sm uppercase tracking-wide">Present</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="text-5xl font-bold mb-2">{summary.late}</div>
          <div className="text-yellow-100 text-sm uppercase tracking-wide">Late</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
          <div className="text-5xl font-bold mb-2">{summary.undertime}</div>
          <div className="text-orange-100 text-sm uppercase tracking-wide">Undertime</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white inline-block">
          <div className="text-5xl font-bold mb-2">{summary.absent}</div>
          <div className="text-red-100 text-sm uppercase tracking-wide">Absent</div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Attendance Rate</h2>
        <div className="text-4xl font-bold text-blue-600">
          {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}%
        </div>
        <p className="text-gray-500 mt-2">Current month attendance rate</p>
      </div>
    </div>
  );
}
