import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import type { Complaint, ComplaintStatus } from '../../types/complaints';
import { ArrowLeft, Bot, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const Investigation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState<ComplaintStatus>('UNDER_INVESTIGATION');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      const all = complaintService.getAll();
      const c = all.find(x => x.id === id);
      if (c) {
        setComplaint(c);
        setStatus(c.status);
      }
    }
  }, [id]);

  const handleUpdate = () => {
    complaintService.updateStatusAndNotes(id as string, status, notes);
    navigate('/officer/dashboard');
  };

  if (!complaint) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 active:scale-95 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-2"><MapPin className="w-4 h-4" /> {complaint.location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-500">{complaint.id}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(complaint.dateReported).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Citizen Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Investigation & Resolution</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as ComplaintStatus)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="WORK_IN_PROGRESS">Work In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected (No Issue Found)</option>
                  <option value="DUPLICATE">Mark as Duplicate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Official Notes</label>
                <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Add investigation findings or resolution details..." />
              </div>
              <button onClick={handleUpdate} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all cursor-pointer">
                Save Updates
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><Bot className="text-primary-400" /> AI Insights</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Priority Score</p>
                <p className="text-3xl font-extrabold text-primary-400">{complaint.aiAnalysis?.priorityScore || '--'}/10</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Severity</p>
                <p className="font-semibold text-white">{complaint.aiAnalysis?.severity || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</p>
                <p className="font-semibold text-white">{complaint.category}</p>
              </div>
              {complaint.aiAnalysis?.isDuplicate && (
                <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg text-xs font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Possible duplicate of an existing issue. Check area history.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
