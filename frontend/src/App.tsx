import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Placeholder Pages
const Landing = () => <div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4">Welcome to CivicAI</h1><p>AI-Powered Community Resolution</p></div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const CitizenDashboard = () => <div className="p-8">Citizen Dashboard</div>;
const OfficerDashboard = () => <div className="p-8">Officer Dashboard</div>;
const AdminDashboard = () => <div className="p-8">Admin Dashboard</div>;
const NotFound = () => <div className="p-8">404 - Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes - Citizen */}
        <Route path="/citizen" element={<MainLayout role="CITIZEN" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
        </Route>

        {/* Protected Routes - Officer */}
        <Route path="/officer" element={<MainLayout role="OFFICER" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
        </Route>

        {/* Protected Routes - Admin */}
        <Route path="/admin" element={<MainLayout role="ADMIN" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
