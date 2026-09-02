import type { User, Role } from '../types/auth';

const USERS_KEY = 'civicai_users';
const CURRENT_USER_KEY = 'civicai_current_user';

export const authService = {
  initDb: () => {
    const existing = localStorage.getItem(USERS_KEY);
    let users = existing ? JSON.parse(existing) : [];
    
    // Ensure critical demo accounts exist
    const ensureUser = (id, name, email, role) => {
      if (!users.find(u => u.email === email)) {
        users.push({ id, name, email, role, createdAt: new Date().toISOString(), isActive: true });
      }
    };
    
    ensureUser('u1', 'System Admin', 'admin@civic.local', 'ADMIN');
    ensureUser('u2', 'Officer Smith', 'officer@civic.local', 'OFFICER');
    ensureUser('u3', 'John Doe', 'citizen@civic.local', 'CITIZEN');
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
