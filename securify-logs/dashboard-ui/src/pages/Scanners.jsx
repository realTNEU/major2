import React, { useState } from 'react';
import { Target, Server, ShieldCheck } from 'lucide-react';

export default function Scanners() {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (tool) => {
    setIsScanning(true);
    setScanResult(`Initializing ${tool} scan on target...`);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, target: 'localhost' })
      });
      const data = await res.json();
      setScanResult(data.result || data.error);
    } catch (err) {
      setScanResult('Scan request failed. Server offline?');
    }
    setIsScanning(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Target size={28} color="var(--accent)" />
        <h1 style={{ margin: 0 }}>Active Scanners</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <Server size={24} color="#3b82f6" />
            <h3 style={{ margin: 0 }}>Node.js Port Scanner</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
            Runs a blazing-fast internal TCP connect scan against common development and production ports (80, 443, 3000, 27017, etc.) on the host machine.
          </p>
          <button 
            onClick={() => handleScan('nmap')} 
            disabled={isScanning}
            style={{ width: '100%', opacity: isScanning ? 0.7 : 1 }}
          >
            {isScanning ? 'Scanning...' : 'Run Port Scan'}
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <ShieldCheck size={24} color="#10b981" />
            <h3 style={{ margin: 0 }}>Vulnerability Scanner</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
            Simulates a lightweight external security audit. Connects to the host HTTP server and analyzes response headers for strict security compliance.
          </p>
          <button 
            onClick={() => handleScan('burp')} 
            disabled={isScanning}
            style={{ width: '100%', backgroundColor: 'var(--success)', opacity: isScanning ? 0.7 : 1 }}
          >
            {isScanning ? 'Scanning...' : 'Run Vuln Scan'}
          </button>
        </div>
      </div>

      <div className="card" style={{ minHeight: '300px' }}>
        <h3 style={{ marginTop: 0 }}>Scan Output Terminal</h3>
        <div style={{ 
          background: '#000', 
          padding: '20px', 
          borderRadius: '8px', 
          minHeight: '200px',
          border: '1px solid #333'
        }}>
          <pre style={{ 
            color: '#0f0', 
            margin: 0, 
            fontFamily: 'monospace', 
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem'
          }}>
            {scanResult || '> Ready to initiate scan...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
