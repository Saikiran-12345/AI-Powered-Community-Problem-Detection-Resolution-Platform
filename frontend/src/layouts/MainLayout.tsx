import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, BarChart3, Settings } from 'lucide-react';

interface MainLayoutProps {
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
}

const MainLayout: React.FC<MainLayoutProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm">C</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CivicAI</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{role} MODE</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
             {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1.5">
             <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</div>
             
             <button onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold bg-primary-50 text-primary-700 rounded-xl">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
             </button>
             <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                <FileText className="w-4 h-4" /> Complaints
             </a>
             {(role === 'ADMIN' || role === 'OFFICER') && (
               <button onClick={() => navigate(`/${role.toLowerCase()}/analytics`)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <BarChart3 className="w-4 h-4" /> Analytics
               </button>
             )}
             {role === 'ADMIN' && (
               <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <Settings className="w-4 h-4" /> System Settings
               </a>
             )}
          </nav>
          
          <div className="pt-4 border-t border-gray-100 mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
