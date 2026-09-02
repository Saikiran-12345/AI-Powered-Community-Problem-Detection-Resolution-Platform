import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, BarChart3, Settings, PlusCircle, Building2 } from 'lucide-react';

interface MainLayoutProps {
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
}

const MainLayout: React.FC<MainLayoutProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
      isActive 
        ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">CivicAI</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold overflow-hidden ring-2 ring-white shadow-sm">
             {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:flex flex-col overflow-y-auto">
          <nav className="flex-1 space-y-2">
             <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</div>
             
             <button onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)} className={navItemClass('dashboard')}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
             </button>

             {role === 'CITIZEN' && (
               <button onClick={() => navigate('/citizen/report')} className={navItemClass('report')}>
                  <PlusCircle className="w-4 h-4" /> Report Issue
               </button>
             )}

             <button onClick={() => navigate(`/${role.toLowerCase()}/complaints`)} className={navItemClass('complaints')}>
                <FileText className="w-4 h-4" /> Complaints Log
             </button>

             {(role === 'ADMIN' || role === 'OFFICER') && (
               <button onClick={() => navigate(`/${role.toLowerCase()}/analytics`)} className={navItemClass('analytics')}>
                  <BarChart3 className="w-4 h-4" /> Analytics
               </button>
             )}

             {role === 'ADMIN' && (
               <button onClick={() => alert('Settings module coming soon')} className={navItemClass('settings')}>
                  <Settings className="w-4 h-4" /> System Settings
               </button>
             )}
          </nav>
          
          <div className="pt-4 border-t border-gray-100 mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
