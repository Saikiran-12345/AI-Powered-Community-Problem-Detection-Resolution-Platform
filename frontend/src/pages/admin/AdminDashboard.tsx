import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types/complaints';
import { BarChart3, Users, FileWarning, ShieldAlert, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [usersCount, setUsersCount] = useState(0);

  const loadData = () => {
    setComplaints(complaintService.getAll());
    const users = JSON.parse(localStorage.getItem('civicai_users') || '[]');
    setUsersCount(users.length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const pendingCount = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'AI_ANALYZED').length;
  const criticalCount = complaints.filter(c => c.aiAnalysis?.severity === 'CRITICAL').length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'CITIZEN_CONFIRMED'].includes(c.status)).length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Command Center</h1>
        <p className="text-gray-500 text-sm mt-1">Global overview of system operations and personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
           <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Users className="w-5 h-5"/></div>
           <div>
             <p className="text-xl font-bold text-gray-900">{usersCount}</p>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Users</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
           <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FileWarning className="w-5 h-5"/></div>
           <div>
             <p className="text-xl font-bold text-gray-900">{complaints.length}</p>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Issues</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
           <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><BarChart3 className="w-5 h-5"/></div>
           <div>
             <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pending</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
           <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle className="w-5 h-5"/></div>
           <div>
             <p className="text-xl font-bold text-gray-900">{resolvedCount}</p>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resolved</p>
           </div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3">
           <div className="p-3 bg-red-100 rounded-xl text-red-600"><ShieldAlert className="w-5 h-5"/></div>
           <div>
             <p className="text-xl font-bold text-red-700">{criticalCount}</p>
             <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Critical Alerts</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
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
