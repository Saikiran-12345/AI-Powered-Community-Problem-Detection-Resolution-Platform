import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, ArrowRight, Building2 } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await register(name, email);
      navigate('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex justify-center mb-6">
        <div className="bg-primary-50 p-3 rounded-2xl">
          <Building2 className="w-8 h-8 text-primary-600" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Create an Account</h1>
        <p className="text-gray-500 text-sm">Join your community to report and track local infrastructure issues.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-gray-900"
              placeholder="Jane Doe"
            />
          </div>
        </div>

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

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary-600/20"
        >
          {isSubmitting ? 'Creating Account...' : <>Create Citizen Account <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-gray-900 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
