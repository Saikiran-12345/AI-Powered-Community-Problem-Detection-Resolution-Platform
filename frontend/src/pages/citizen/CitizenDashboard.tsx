import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types/complaints';
import { AlertCircle, CheckCircle2, Clock, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (user) {
      setComplaints(complaintService.getByCitizen(user.id));
    }
  }, [user]);

  const stats = {
    total: complaints.length,
    active: complaints.filter(c => !['RESOLVED', 'CITIZEN_CONFIRMED', 'REJECTED', 'DUPLICATE'].includes(c.status)).length,
    resolved: complaints.filter(c => ['RESOLVED', 'CITIZEN_CONFIRMED'].includes(c.status)).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Here's the status of your reported community issues.</p>
        </div>
        <button 
          onClick={() => navigate('/citizen/report')}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Report Issue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-gray-50 rounded-xl text-gray-600"><AlertCircle className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-amber-50 rounded-xl text-amber-600"><Clock className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Progress</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-green-50 rounded-xl text-green-600"><CheckCircle2 className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resolved</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Complaints</h2>
          <button onClick={() => navigate('/citizen/complaints')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {complaints.length === 0 ? (
             <div className="p-12 text-center text-gray-500">
               <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
               <p className="font-medium text-gray-900 mb-1">No complaints found</p>
               <p className="text-sm mb-4">You haven't reported any community issues yet.</p>
               <button onClick={() => navigate('/citizen/report')} className="text-primary-600 font-semibold text-sm hover:underline">Report your first issue</button>
             </div>
          ) : (
             complaints.slice(0, 5).map(c => (
               <div key={c.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/citizen/complaints/${c.id}`)}>
                 <div className="flex items-start justify-between">
                   <div>
                     <div className="flex items-center gap-3 mb-1">
                       <span className="text-xs font-bold text-gray-500">{c.id}</span>
                       <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">{c.status.replace('_', ' ')}</span>
                     </div>
                     <h3 className="font-semibold text-gray-900">{c.title}</h3>
                     <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/> {c.location}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500">{new Date(c.dateReported).toLocaleDateString()}</p>
                   </div>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};
