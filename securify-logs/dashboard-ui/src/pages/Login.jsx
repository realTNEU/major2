import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <ShieldAlert size={48} color="var(--accent)" />
          <h2 style={{ marginTop: '10px' }}>Admin Access</h2>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
