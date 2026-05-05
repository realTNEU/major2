import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, LayoutDashboard } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRequests: 0, totalThreats: 0, pieData: [] });
  const [lineData, setLineData] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) setStats(await statsRes.json());

      const logsRes = await fetch('/api/logs');
      if (logsRes.ok) {
        const logs = await logsRes.json();
        
        // Compute line chart data (requests per minute)
        const timeMap = {};
        logs.forEach(log => {
          // Format as HH:mm
          const date = new Date(log.timestamp);
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${Math.floor(date.getSeconds() / 10) * 10}`; // Group by 10 seconds
          timeMap[timeStr] = (timeMap[timeStr] || 0) + 1;
        });

        const sortedTimes = Object.keys(timeMap).sort();
        const formattedLineData = sortedTimes.map(time => ({
          time,
          requests: timeMap[time]
        }));
        setLineData(formattedLineData.slice(-20)); // Keep last 20 periods
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <LayoutDashboard size={28} color="var(--accent)" />
        <h1 style={{ margin: 0 }}>Security Analytics Overview</h1>
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="var(--accent)" />
            <h3>Total Requests Intercepted</h3>
          </div>
          <p style={{ fontSize: '3rem', margin: '10px 0 0 0', fontWeight: 'bold' }}>{stats.totalRequests}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert color="var(--danger)" />
            <h3>High-Risk Threats Detected</h3>
          </div>
          <p style={{ fontSize: '3rem', margin: '10px 0 0 0', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.totalThreats}</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ height: '400px' }}>
          <h3>Threat Distribution Profile</h3>
          {stats.pieData && stats.pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.pieData} 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No threats detected yet.
            </div>
          )}
        </div>

        <div className="card" style={{ height: '400px' }}>
          <h3>Traffic Volume Over Time</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Awaiting traffic...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
