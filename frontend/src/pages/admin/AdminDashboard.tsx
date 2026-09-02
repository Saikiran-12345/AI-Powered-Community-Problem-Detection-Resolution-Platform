import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types/complaints';
import { BarChart3, Users, FileWarning, ShieldAlert } from 'lucide-react';

export const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    setComplaints(complaintService.getAll());
    const users = JSON.parse(localStorage.getItem('civicai_users') || '[]');
    setUsersCount(users.length);
  }, []);

  const pendingCount = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'AI_ANALYZED').length;
  const criticalCount = complaints.filter(c => c.aiAnalysis?.severity === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Command Center</h1>
        <p className="text-gray-500 text-sm mt-1">Global overview of system operations and personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600"><Users className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><FileWarning className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Issues</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-amber-50 rounded-xl text-amber-600"><BarChart3 className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Routing</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-red-50 rounded-xl text-red-600"><ShieldAlert className="w-6 h-6"/></div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Critical AI Alerts</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Audit Logs</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 italic">Audit system integrated. Logs will appear here as users interact with the system.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Local AI Engine</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-xs">ONLINE</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Persistence Layer</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-xs">HEALTHY</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
