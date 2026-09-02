import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 text-red-600 rounded-full">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-8">You do not have the necessary permissions to access this page.</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
          Return to Safety
        </Link>
      </div>
    </div>
  );
};
