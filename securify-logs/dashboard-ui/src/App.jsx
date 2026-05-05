import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Database, Target, Settings as SettingsIcon, LogOut } from 'lucide-react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Scanners from './pages/Scanners';
import Settings from './pages/Settings';
import Insights from './pages/Insights';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    navigate('/login');
  };

  const navs = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Logs Explorer', path: '/logs', icon: <Database size={20} /> },
    { name: 'Active Scans', path: '/scans', icon: <Target size={20} /> },
    { name: 'AI Insights', path: '/insights', icon: <Shield size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> }
  ];

  return (
    <div className="sidebar">
      <h2><Shield /> Securify Logs</h2>
      <div style={{ flex: 1 }}>
        {navs.map(nav => (
          <Link 
            key={nav.name} 
            to={nav.path} 
            className={`nav-link ${location.pathname === nav.path ? 'active' : ''}`}
          >
            {nav.icon} {nav.name}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--border)' }}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

// Protected Route Component to enforce Login Flow
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Securify...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
        <Route path="/scans" element={<ProtectedRoute><Scanners /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
