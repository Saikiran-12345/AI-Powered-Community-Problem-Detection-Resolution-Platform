import React from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
}

const MainLayout: React.FC<MainLayoutProps> = ({ role }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CivicAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{role} MODE</span>
          <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block overflow-y-auto">
          <nav className="space-y-1">
             <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</div>
             <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg">Dashboard</a>
             <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Complaints</a>
             <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Analytics</a>
             <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg mt-8 text-red-600">Logout</a>
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
