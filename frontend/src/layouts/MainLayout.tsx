import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, BarChart3, Settings, PlusCircle, Building2, Users } from 'lucide-react';

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
    return `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
      isActive 
        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 translate-x-1' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:translate-x-1'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-100 selection:bg-primary-200 selection:text-primary-900">
      
      {/* Sleek Dark Header */}
      <header className="bg-[#0B1120] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl shadow-slate-900/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 border border-primary-400/20">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CivicAI</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-100">{user?.name}</p>
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm hover:border-primary-500 transition-colors cursor-pointer">
             {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Glassmorphic Sidebar */}
        <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 p-5 hidden md:flex flex-col overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-10">
          <nav className="flex-1 space-y-2 mt-2">
             <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Main Menu</div>
             
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
               <>
                 <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-8 mb-2">Administration</div>
                 <button onClick={() => navigate('/admin/users')} className={navItemClass('users')}>
                    <Users className="w-4 h-4" /> User Management
                 </button>
                 <button onClick={() => navigate('/admin/settings')} className={navItemClass('settings')}>
                    <Settings className="w-4 h-4" /> System Settings
                 </button>
               </>
             )}
          </nav>
          
          <div className="pt-6 border-t border-slate-200/60 mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>
        
        {/* Beautiful Gradient Background for Main Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/60 via-slate-100 to-slate-200/80">
          
          {/* Subtle decorative background blur elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="max-w-7xl mx-auto relative z-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
