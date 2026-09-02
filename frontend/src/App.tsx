import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Unauthorized } from './pages/auth/Unauthorized';

// Placeholder Dashboards
const Landing = () => <Navigate to="/login" replace />;
const CitizenDashboard = () => <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"><h1 className="text-2xl font-bold mb-4">Citizen Dashboard</h1><p className="text-gray-500">Welcome to your community portal.</p></div>;
const OfficerDashboard = () => <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"><h1 className="text-2xl font-bold mb-4">Operations Dashboard</h1><p className="text-gray-500">Welcome to your operational overview.</p></div>;
const AdminDashboard = () => <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"><h1 className="text-2xl font-bold mb-4">Command Center</h1><p className="text-gray-500">Welcome to the administration panel.</p></div>;
const NotFound = () => <div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - Citizen */}
          <Route path="/citizen" element={
            <ProtectedRoute allowedRoles={['CITIZEN']}>
              <MainLayout role="CITIZEN" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
          </Route>

          {/* Protected Routes - Officer */}
          <Route path="/officer" element={
            <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
              <MainLayout role="OFFICER" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OfficerDashboard />} />
          </Route>

          {/* Protected Routes - Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MainLayout role="ADMIN" />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
