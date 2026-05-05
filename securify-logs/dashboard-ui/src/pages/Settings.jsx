import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <SettingsIcon size={28} color="var(--accent)" />
        <h1 style={{ margin: 0 }}>System Settings</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h3>Dashboard Preferences</h3>
        
        {saveStatus && (
          <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '6px', marginBottom: '15px' }}>
            {saveStatus}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Polling Interval (Seconds)</label>
            <select style={{ 
              width: '100%', padding: '10px', background: 'var(--bg-dark)', 
              color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '6px' 
            }}>
              <option value="1">1 Second (Aggressive)</option>
              <option value="3" selected>3 Seconds (Balanced)</option>
              <option value="10">10 Seconds (Relaxed)</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Log Retention (Days)</label>
            <input type="number" defaultValue="30" />
          </div>

          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Save Configurations
          </button>
        </form>
      </div>
    </div>
  );
}
