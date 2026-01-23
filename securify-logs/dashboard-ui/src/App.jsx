import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Scans } from './pages/Scans';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login onLoginSuccess={() => setCurrentPage('dashboard')} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'scans':
        return <Scans />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Header onNavigate={setCurrentPage} />
      
      <nav className="sidebar">
        <ul>
          <li>
            <button 
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button 
              className={currentPage === 'scans' ? 'active' : ''}
              onClick={() => setCurrentPage('scans')}
            >
              🔍 Vulnerability Scans
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="container">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
