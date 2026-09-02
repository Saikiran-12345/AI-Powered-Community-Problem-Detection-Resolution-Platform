import { Complaint } from '../types/complaints';

const COMPLAINTS_KEY = 'civicai_complaints';

export const complaintService = {
  getAll: (): Complaint[] => {
    return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
  },
  
  getByCitizen: (citizenId: string): Complaint[] => {
    return complaintService.getAll().filter(c => c.citizenId === citizenId);
  },

  create: (complaint: Omit<Complaint, 'id' | 'status' | 'dateReported'>): Complaint => {
    const complaints = complaintService.getAll();
    const newComplaint: Complaint = {
      ...complaint,
      id: `CIV-${Math.floor(Math.random() * 10000)}`,
      status: 'SUBMITTED',
      dateReported: new Date().toISOString()
    };
    complaints.push(newComplaint);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return newComplaint;
  },
  
  updateAnalysis: (id: string, analysis: any) => {
    const complaints = complaintService.getAll();
    const idx = complaints.findIndex(c => c.id === id);
    if(idx !== -1) {
       complaints[idx].aiAnalysis = analysis;
       complaints[idx].status = 'AI_ANALYZED';
       localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    }
  },

  analyzeWithLocalAI: async (title: string, description: string): Promise<any> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      if (!response.ok) throw new Error('Local AI Engine is offline');
      return await response.json();
    } catch (e) {
      console.warn('Local AI offline, falling back to basic analysis', e);
      return {
        category: 'Unclassified',
        severity: 'MEDIUM',
        priorityScore: 5.0,
        recommendedDepartmentId: 'general_ops',
        isDuplicate: false
      };
    }
  }
};
