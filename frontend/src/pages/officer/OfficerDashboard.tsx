import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types/complaints';
import { ClipboardList, Flame, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<Complaint[]>([]);

  useEffect(() => {
    // In a real app, filter by department. Here we just grab active items.
    const all = complaintService.getAll();
    setQueue(all.filter(c => !['RESOLVED', 'CITIZEN_CONFIRMED', 'REJECTED'].includes(c.status))
                 .sort((a, b) => (b.aiAnalysis?.priorityScore || 0) - (a.aiAnalysis?.priorityScore || 0)));
  }, []);

  const highPriorityCount = queue.filter(c => c.aiAnalysis?.priorityScore && c.aiAnalysis.priorityScore >= 8).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage, investigate, and resolve infrastructure issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-gray-500"><ClipboardList className="w-5 h-5"/> <span className="text-xs font-bold uppercase">Active Queue</span></div>
           <p className="text-3xl font-extrabold text-gray-900">{queue.length}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-red-500"><Flame className="w-5 h-5"/> <span className="text-xs font-bold uppercase">Critical Priority</span></div>
           <p className="text-3xl font-extrabold text-red-700">{highPriorityCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-gray-500"><Activity className="w-5 h-5"/> <span className="text-xs font-bold uppercase">Avg Resolution</span></div>
           <p className="text-3xl font-extrabold text-gray-900">2.4<span className="text-sm font-medium text-gray-500 ml-1">days</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-gray-500"><MapPin className="w-5 h-5"/> <span className="text-xs font-bold uppercase">Hotspots</span></div>
           <p className="text-3xl font-extrabold text-gray-900">3</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Priority Investigation Queue</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {queue.length === 0 ? (
             <div className="p-12 text-center text-gray-500 font-medium">No active complaints in the queue.</div>
          ) : (
             queue.map(c => (
               <div key={c.id} className="p-6 hover:bg-gray-50 transition-colors">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                       <span className="text-xs font-bold text-gray-500">{c.id}</span>
                       <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${c.aiAnalysis?.severity === 'CRITICAL' || c.aiAnalysis?.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                         {c.aiAnalysis?.severity || 'PENDING'}
                       </span>
                       <span className="text-xs font-semibold text-gray-400">{c.category}</span>
                     </div>
                     <h3 className="font-bold text-gray-900 text-lg">{c.title}</h3>
                     <p className="text-sm text-gray-500 mt-1">{c.location}</p>
                   </div>
                   <div className="flex items-center gap-6">
                     <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AI Score</p>
                        <p className="text-xl font-extrabold text-gray-900">{c.aiAnalysis?.priorityScore?.toFixed(1) || '--'}</p>
                     </div>
                     <button onClick={() => navigate(`/officer/investigate/${c.id}`)} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800">
                       Investigate
                     </button>
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
