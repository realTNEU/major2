import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader } from 'lucide-react';

export default function Insights() {
  const [report, setReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/insights', { method: 'POST' });
      const data = await res.json();
      setReport(data.report || data.error);
    } catch (err) {
      setReport('**Error:** Failed to connect to Securify backend.');
    }
    setIsGenerating(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Sparkles size={28} color="var(--accent)" />
        <h1 style={{ margin: 0 }}>Gemini AI Insights</h1>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>Automated Threat Analysis</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Harness the power of Gemini 2.5 Flash to automatically aggregate recent logs, detect hidden attack patterns, and recommend firewall rules.
          </p>
        </div>
        <button 
          onClick={generateReport} 
          disabled={isGenerating}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: isGenerating ? 'var(--border)' : 'var(--accent)',
            minWidth: '200px', justifyContent: 'center'
          }}
        >
          {isGenerating ? <Loader size={18} className="spin" /> : <Sparkles size={18} />}
          {isGenerating ? 'Analyzing Logs...' : 'Generate AI Report'}
        </button>
      </div>

      {report && (
        <div className="card" style={{ minHeight: '400px', padding: '30px', lineHeight: '1.6' }}>
          <div className="markdown-content">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {/* Simple spin animation for the loader icon */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .markdown-content h2 { color: var(--accent); margin-top: 0; }
        .markdown-content h3 { color: var(--success); }
        .markdown-content ul { padding-left: 20px; color: var(--text-muted); }
        .markdown-content li { margin-bottom: 8px; }
        .markdown-content strong { color: var(--text-main); }
      `}</style>
    </div>
  );
}
