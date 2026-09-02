import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { useNavigate } from 'react-router-dom';
import { Bot, MapPin, CheckCircle } from 'lucide-react';

export const ReportProblem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads',
    location: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return;
    setIsSubmitting(true);
    
    // Create record
    const complaint = complaintService.create({
      citizenId: user.id,
      ...formData
    });

    // Simulate AI processing
    setTimeout(() => {
      const mockAiAnalysis = {
        category: formData.category,
        severity: 'HIGH',
        priorityScore: 8.7,
        recommendedDepartmentId: 'dept_1',
        isDuplicate: false
      };
      
      complaintService.updateAnalysis(complaint.id, mockAiAnalysis);
      setAiResult({ complaintId: complaint.id, ...mockAiAnalysis });
      setIsSubmitting(false);
    }, 1500);
  };

  if (aiResult) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
        <p className="text-gray-500 mb-8">Your issue ({aiResult.complaintId}) has been processed by our AI engine.</p>
        
        <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900"><Bot className="text-primary-600"/> Local AI Analysis</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Severity:</span> <span className="font-bold text-red-600">{aiResult.severity}</span></div>
            <div><span className="text-gray-500">Priority Score:</span> <span className="font-bold text-gray-900">{aiResult.priorityScore}/10</span></div>
            <div><span className="text-gray-500">Assigned To:</span> <span className="font-bold text-gray-900">Road Maintenance</span></div>
            <div><span className="text-gray-500">Duplicate Check:</span> <span className="font-bold text-green-600">Unique Issue</span></div>
          </div>
        </div>

        <button onClick={() => navigate('/citizen/dashboard')} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report a Community Problem</h1>
        <p className="text-gray-500 text-sm mt-1">Our AI system will automatically classify and prioritize your report for the correct department.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Problem Title</label>
            <input 
              required type="text" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g., Large pothole near central school"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select 
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option>Roads & Infrastructure</option>
                <option>Water & Sewage</option>
                <option>Electricity & Streetlights</option>
                <option>Sanitation & Garbage</option>
                <option>Public Parks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  required type="text" 
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Street name or landmark"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
            <textarea 
              required rows={5}
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="Provide as much detail as possible to help our AI accurately prioritize this issue..."
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <><Bot className="w-5 h-5 animate-pulse" /> AI is analyzing report...</> : 'Submit Report for AI Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
};
