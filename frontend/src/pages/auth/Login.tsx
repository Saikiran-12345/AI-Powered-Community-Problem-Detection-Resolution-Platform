import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  const performLogin = async (targetEmail: string) => {
    setError('');
    setIsSubmitting(true);
    try {
      await login(targetEmail);
      const user = JSON.parse(localStorage.getItem('civicai_current_user') || '{}');
if (from) {
        // Prevent cross-role routing traps (e.g. logging out as Officer, then logging in as Admin, being sent back to /officer)
        if (user.role === 'ADMIN' && !from.startsWith('/admin')) navigate('/admin/dashboard');
        else if (user.role === 'OFFICER' && !from.startsWith('/officer')) navigate('/officer/dashboard');
        else if (user.role === 'CITIZEN' && !from.startsWith('/citizen')) navigate('/citizen/dashboard');
        else navigate(from, { replace: true });
      } else {
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'OFFICER') navigate('/officer/dashboard');
        else navigate('/citizen/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    performLogin(demoEmail);
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-4">
        <div className="bg-primary-50 p-2.5 rounded-2xl">
          <Building2 className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      
      <div className="text-center mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Welcome to CivicAI</h1>
        <p className="text-gray-500 text-sm">Sign in to report or manage community infrastructure issues.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-gray-900"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-gray-900"
              placeholder="••••••••"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">Any password works for demo</p>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? 'Authenticating...' : <>Secure Sign In <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">1-Click Demo Login</p>
        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={() => fillDemo('citizen@civic.local')} className="py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 active:scale-95">Citizen</button>
          <button type="button" onClick={() => fillDemo('officer@civic.local')} className="py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 active:scale-95">Officer</button>
          <button type="button" onClick={() => fillDemo('admin@civic.local')} className="py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 active:scale-95">Admin</button>
        </div>
      </div>
    </div>
  );
};
