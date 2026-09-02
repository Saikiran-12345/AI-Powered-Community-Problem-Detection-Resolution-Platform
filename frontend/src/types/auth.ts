export type Role = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
