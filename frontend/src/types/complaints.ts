export type ComplaintStatus = 'SUBMITTED' | 'AI_ANALYZED' | 'ASSIGNED' | 'UNDER_INVESTIGATION' | 'WORK_IN_PROGRESS' | 'RESOLVED' | 'CITIZEN_CONFIRMED' | 'REJECTED' | 'DUPLICATE';

export interface AIAnalysis {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityScore: number;
  recommendedDepartmentId: string;
  isDuplicate: boolean;
  duplicateId?: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: string;
  status: ComplaintStatus;
  aiAnalysis?: AIAnalysis;
  assignedOfficerId?: string;
  assignedDepartmentId?: string;
}
