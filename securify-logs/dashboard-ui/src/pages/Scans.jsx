import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, getStatusBadge, getSeverityColor } from '../utils/helpers';
import './Scans.css';

export const Scans = () => {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    scanType: '',
    page: 1
  });
  const [triggering, setTriggering] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchScans();
    const interval = setInterval(fetchScans, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const fetchScans = async () => {
    try {
      const res = await fetch(`/api/scans?page=${filters.page}&status=${filters.status}&scanType=${filters.scanType}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setScans(data.scans);
      }
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async (scanType) => {
    if (!user?.role || user.role !== 'admin') {
      alert('Only admins can trigger scans');
      return;
    }

    setTriggering(true);
    try {
      const res = await fetch('/api/scans/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scanType,
          target: 'localhost'
        })
      });

      if (res.ok) {
        alert('Scan triggered successfully');
        fetchScans();
      } else {
        alert('Failed to trigger scan');
      }
    } catch (error) {
      alert('Error triggering scan: ' + error.message);
    } finally {
      setTriggering(false);
    }
  };

  const handleViewDetails = async (scanId) => {
    try {
      const res = await fetch(`/api/scans/${scanId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        setSelectedScan(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch scan details:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="scans">
      <h2>Vulnerability Scans</h2>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <div className="quick-actions">
          <button onClick={() => triggerScan('port_scan')} disabled={triggering} className="btn btn-primary">
            🔍 Port Scan
          </button>
          <button onClick={() => triggerScan('sql_injection')} disabled={triggering} className="btn btn-primary">
            💉 SQL Injection Test
          </button>
          <button onClick={() => triggerScan('xss')} disabled={triggering} className="btn btn-primary">
            ✂️ XSS Test
          </button>
          <button onClick={() => triggerScan('full')} disabled={triggering} className="btn btn-primary">
            🔐 Full Scan
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.scanType}
          onChange={(e) => setFilters({ ...filters, scanType: e.target.value, page: 1 })}
        >
          <option value="">All Scan Types</option>
          <option value="port_scan">Port Scan</option>
          <option value="sql_injection">SQL Injection</option>
          <option value="xss">XSS</option>
          <option value="directory_traversal">Directory Traversal</option>
          <option value="full">Full Scan</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Scans List */}
      <div className="scans-list">
        {scans.length === 0 ? (
          <p className="no-data">No scans found</p>
        ) : (
          scans.map((scan) => (
            <div key={scan._id} className="scan-item">
              <div className="scan-header">
                <div className="scan-title">
                  <span className="scan-type">{scan.scanType.toUpperCase()}</span>
                  <span className={`badge badge-${getStatusBadge(scan.status)}`}>
                    {scan.status.toUpperCase()}
                  </span>
                </div>
                <div className="scan-meta">
                  <span>{scan.target}</span>
                  <span>{formatDate(scan.createdAt)}</span>
                </div>
              </div>

              {scan.status === 'completed' && scan.summary && (
                <div className="scan-summary">
                  <div className="summary-item critical">{scan.summary.critical} Critical</div>
                  <div className="summary-item high">{scan.summary.high} High</div>
                  <div className="summary-item medium">{scan.summary.medium} Medium</div>
                  <div className="summary-item low">{scan.summary.low} Low</div>
                </div>
              )}

              <button
                className="btn btn-secondary"
                onClick={() => handleViewDetails(scan._id)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedScan && (
        <div className="modal-overlay" onClick={() => setSelectedScan(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScan(null)}>✕</button>

            <h3>{selectedScan.scanType.toUpperCase()} - Details</h3>

            {selectedScan.findings && selectedScan.findings.length > 0 ? (
              <div className="findings-list">
                {selectedScan.findings.map((finding, idx) => (
                  <div key={idx} className={`finding finding-${finding.severity}`}>
                    <div className="finding-title">
                      {finding.title}
                      <span className={`badge badge-${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                    </div>
                    <p className="finding-desc">{finding.description}</p>
                    <p className="finding-rec"><strong>Recommendation:</strong> {finding.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-findings">No findings in this scan</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
