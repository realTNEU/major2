import React, { useState, useEffect } from 'react';
import { formatDate, formatDuration } from '../utils/helpers';
import './Dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    suspicious: '',
    method: '',
    page: 1
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('/api/stats', { credentials: 'include' }),
        fetch(`/api/logs?page=${filters.page}&suspicious=${filters.suspicious}&method=${filters.method}`, { credentials: 'include' })
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Requests</div>
          <div className="stat-value">{stats?.overview.totalRequests}</div>
        </div>
        <div className="stat-card alert">
          <div className="stat-label">Suspicious Requests</div>
          <div className="stat-value">{stats?.overview.suspiciousRequests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Threat Rate</div>
          <div className="stat-value">{stats?.overview.threatRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Requests (24h)</div>
          <div className="stat-value">{stats?.overview.requests24h}</div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section">
        <h3>Request Logs</h3>

        <div className="filters">
          <select
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value, page: 1 })}
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>

          <select
            value={filters.suspicious}
            onChange={(e) => setFilters({ ...filters, suspicious: e.target.value, page: 1 })}
          >
            <option value="">All Requests</option>
            <option value="true">Suspicious Only</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Method</th>
                <th>Path</th>
                <th>IP</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {logs.logs?.map((log) => (
                <tr key={log._id} className={log.suspicious ? 'suspicious' : ''}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td><span className="method-badge">{log.method}</span></td>
                  <td className="path-cell">{log.path}</td>
                  <td>{log.ip}</td>
                  <td>
                    <span className={`status-badge status-${log.statusCode}`}>
                      {log.statusCode}
                    </span>
                  </td>
                  <td>{formatDuration(log.duration)}</td>
                  <td>
                    {log.flags.length > 0 ? (
                      <div className="flags">
                        {log.flags.map((flag) => (
                          <span key={flag} className="flag-badge">{flag}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
