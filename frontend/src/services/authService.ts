import type { User, Role } from '../types/auth';

const USERS_KEY = 'civicai_users';
const CURRENT_USER_KEY = 'civicai_current_user';

export const authService = {
  initDb: () => {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      // Seed default accounts
      const defaultUsers: User[] = [
        { id: 'u1', name: 'System Admin', email: 'admin@civic.local', role: 'ADMIN', createdAt: new Date().toISOString(), isActive: true },
        { id: 'u2', name: 'Officer Smith', email: 'officer@civic.local', role: 'OFFICER', departmentId: 'd1', createdAt: new Date().toISOString(), isActive: true },
        { id: 'u3', name: 'John Doe', email: 'citizen@civic.local', role: 'CITIZEN', createdAt: new Date().toISOString(), isActive: true }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
  },

  login: async (email: string): Promise<User> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    
    if (!user) throw new Error('Invalid credentials or inactive account');
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'CITIZEN', // Only citizens self-register
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};
