import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Unauthorized } from './pages/auth/Unauthorized';

import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportProblem } from './pages/citizen/ReportProblem';

import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerComplaintsLog } from './pages/officer/OfficerComplaintsLog';
import { Investigation } from './pages/officer/Investigation';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AnalyticsDashboard } from './pages/admin/AnalyticsDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { SystemSettings } from './pages/admin/SystemSettings';

const Landing = () => <Navigate to="/login" replace />;
const NotFound = () => <div className="p-8 text-center font-bold text-2xl text-gray-900 mt-20">404 - Area Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/citizen" element={<ProtectedRoute allowedRoles={['CITIZEN']}><MainLayout role="CITIZEN" /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="report" element={<ReportProblem />} />
            <Route path="complaints" element={<CitizenDashboard />} />
          </Route>

          <Route path="/officer" element={<ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}><MainLayout role="OFFICER" /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OfficerDashboard />} />
            <Route path="complaints" element={<OfficerComplaintsLog />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="investigate/:id" element={<Investigation />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><MainLayout role="ADMIN" /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="complaints" element={<OfficerComplaintsLog />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
