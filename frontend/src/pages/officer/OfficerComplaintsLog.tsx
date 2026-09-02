import React, { useEffect, useState } from 'react';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types/complaints';
import { FileText, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfficerComplaintsLog = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const all = complaintService.getAll() || [];
      const sorted = all.sort((a, b) => {
        const timeA = a.dateReported ? new Date(a.dateReported).getTime() : 0;
        const timeB = b.dateReported ? new Date(b.dateReported).getTime() : 0;
        return (timeB || 0) - (timeA || 0);
      });
      setComplaints(sorted.slice(0, 100)); // limit to 100 to prevent lag
    } catch (e) {
      console.error("Failed to load complaints:", e);
      setComplaints([]);
    }
  }, []);

  const filteredComplaints = complaints.filter(c => 
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints Log</h1>
          <p className="text-gray-500 text-sm mt-1">Full historical registry of all reported community issues.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm w-full md:w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm active:scale-95 cursor-pointer">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Title & Category</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    No complaints found matching your search.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map(c => (
                  <tr key={c.id || Math.random().toString()} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{c.id || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {c.dateReported ? new Date(c.dateReported).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900">{c.title || 'Untitled'}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{c.category || 'Uncategorized'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                        c.status === 'REJECTED' ? 'bg-gray-100 text-gray-600' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {(c.status || 'UNKNOWN').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {c.aiAnalysis?.priorityScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${c.aiAnalysis.priorityScore >= 7 ? 'bg-red-500' : c.aiAnalysis.priorityScore >= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${(c.aiAnalysis.priorityScore / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{c.aiAnalysis.priorityScore}/10</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => navigate(`/officer/investigate/${c.id}`)}
                        className="text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
