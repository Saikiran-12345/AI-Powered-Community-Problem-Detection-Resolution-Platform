import React, { useEffect, useState } from 'react';
import type { User, Role } from '../../types/auth';
import { Users, Shield, CheckCircle, XCircle, Search, Edit2 } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const data = JSON.parse(localStorage.getItem('civicai_users') || '[]');
    setUsers(data);
  };

  const toggleUserStatus = (id: string, currentStatus: boolean) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u);
    localStorage.setItem('civicai_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const changeRole = (id: string, newRole: Role) => {
    const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
    localStorage.setItem('civicai_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Control access, assign roles, and manage civic personnel.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm w-full md:w-72 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      {u.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-red-500" />}
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      disabled={u.email === 'admin@civic.local'}
                      className="text-xs font-bold bg-gray-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      <option value="CITIZEN">Citizen</option>
                      <option value="OFFICER">Officer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {u.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => toggleUserStatus(u.id, u.isActive)}
                      disabled={u.email === 'admin@civic.local'}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 ${u.isActive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                    >
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
