import React, { useEffect, useState, useMemo } from 'react';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types/complaints';
import { FileText, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SortField = 'id' | 'date' | 'title' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

export const OfficerComplaintsLog = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const all = complaintService.getAll() || [];
      setComplaints(all.slice(0, 150)); // Load top 150 for performance
    } catch (e) {
      console.error("Failed to load complaints:", e);
      setComplaints([]);
    }
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sorts
    }
  };

  const processedComplaints = useMemo(() => {
    // Filter
    const filtered = complaints.filter(c => 
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = (a.id || '').localeCompare(b.id || '');
      } else if (sortField === 'date') {
        const timeA = a.dateReported ? new Date(a.dateReported).getTime() : 0;
        const timeB = b.dateReported ? new Date(b.dateReported).getTime() : 0;
        comparison = timeA - timeB;
      } else if (sortField === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      } else if (sortField === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '');
      } else if (sortField === 'priority') {
        const pA = a.aiAnalysis?.priorityScore || 0;
        const pB = b.aiAnalysis?.priorityScore || 0;
        comparison = pA - pB;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [complaints, searchTerm, sortField, sortDirection]);

  const Th = ({ field, label }: { field: SortField, label: string }) => (
    <th 
      onClick={() => handleSort(field)} 
      className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-primary-600' : 'text-gray-300'}`} />
      </div>
    </th>
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
                <Th field="id" label="ID" />
                <Th field="date" label="Date" />
                <Th field="title" label="Title & Category" />
                <Th field="status" label="Status" />
                <Th field="priority" label="Priority" />
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    No complaints found matching your criteria.
                  </td>
                </tr>
              ) : (
                processedComplaints.map(c => (
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
                          <span className="text-xs font-bold text-gray-700">{c.aiAnalysis.priorityScore.toFixed(1)}/10</span>
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
