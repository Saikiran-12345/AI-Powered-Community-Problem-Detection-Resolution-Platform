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
  }
};
