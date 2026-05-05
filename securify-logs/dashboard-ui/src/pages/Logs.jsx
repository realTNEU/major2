import React, { useEffect, useState } from 'react';
import { Database, Search } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterThreats, setFilterThreats] = useState(false);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.includes(searchTerm);
    const matchesThreat = filterThreats ? (log.flags && log.flags.length > 0) : true;
    return matchesSearch && matchesThreat;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Database size={28} color="var(--accent)" />
        <h1 style={{ margin: 0 }}>Log Explorer</h1>
      </div>

      <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', padding: '15px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, background: 'var(--bg-dark)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search paths, methods, IPs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', margin: 0, padding: 0, outline: 'none', flex: 1 }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={filterThreats} 
            onChange={(e) => setFilterThreats(e.target.checked)} 
            style={{ width: 'auto', margin: 0 }}
          />
          Show Only Threats
        </label>
      </div>

      <div className="card">
        <table style={{ fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Method</th>
              <th>Path</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Threat Flags</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
              <tr key={i}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td><strong style={{ color: log.method === 'GET' ? 'var(--success)' : 'var(--accent)' }}>{log.method}</strong></td>
                <td style={{ wordBreak: 'break-all' }}>{log.url}</td>
                <td>{log.statusCode}</td>
                <td>{log.ip}</td>
                <td>
                  {log.flags && log.flags.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {log.flags.map((f, j) => <span key={j} className="badge badge-danger">{f}</span>)}
                    </div>
                  ) : (
                    <span className="badge badge-success">CLEAN</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
