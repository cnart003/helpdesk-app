import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/api/tickets';

const PRIORITY_COLORS = {
  Low: '#d1fae5',
  Medium: '#fef3c7',
  High: '#fee2e2',
  Critical: '#7f1d1d',
};

const PRIORITY_TEXT = {
  Low: '#065f46',
  Medium: '#92400e',
  High: '#991b1b',
  Critical: '#ffffff',
};

const STATUS_COLORS = {
  Open: '#fef3c7',
  'In Progress': '#dbeafe',
  Resolved: '#d1fae5',
  Closed: '#f3f4f6',
};

const STATUS_TEXT = {
  Open: '#92400e',
  'In Progress': '#1e40af',
  Resolved: '#065f46',
  Closed: '#374151',
};

function Badge({ label, bgColor, textColor }) {
  return (
    <span style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
      marginRight: '6px',
    }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, borderColor }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${borderColor}`,
      flex: 1,
    }}>
      <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  );
}

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tickets');
        return res.json();
      })
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = tickets.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.submitter_name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f2f5', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ background: '#1a73e8', padding: '0 30px', display: 'flex', alignItems: 'center', height: '60px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <span style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>🖥️ IT Help Desk</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '16px', fontSize: '14px' }}>React Dashboard</span>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', color: '#1a1a2e' }}>Ticket Dashboard</h1>
          <a href="http://127.0.0.1:5000/submit" target="_blank" rel="noreferrer"
            style={{ padding: '8px 18px', background: '#1a73e8', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
            + New Ticket
          </a>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <StatCard label="Total Tickets" value={stats.total} borderColor="#1a73e8" />
          <StatCard label="Open" value={stats.open} borderColor="#f59e0b" />
          <StatCard label="In Progress" value={stats.inProgress} borderColor="#3b82f6" />
          <StatCard label="Resolved" value={stats.resolved} borderColor="#10b981" />
        </div>

        {/* FILTERS */}
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', minWidth: '200px' }}
          />
          <label style={{ fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Status:
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
              {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Priority:
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
              {['All', 'Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
            </select>
          </label>
          <span style={{ fontSize: '13px', color: '#888', marginLeft: 'auto' }}>{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* TABLE */}
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading tickets...</div>}
          {error && <div style={{ padding: '40px', textAlign: 'center', color: '#991b1b' }}>Error: {error} — Make sure the Flask server is running.</div>}
          {!loading && !error && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  {['#', 'Title', 'Category', 'Priority', 'Status', 'Submitted By', 'Created'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#555', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No tickets found.</td></tr>
                ) : (
                  filtered.map(ticket => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{ticket.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500' }}>{ticket.title}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{ticket.category}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge label={ticket.priority} bgColor={PRIORITY_COLORS[ticket.priority]} textColor={PRIORITY_TEXT[ticket.priority]} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge label={ticket.status} bgColor={STATUS_COLORS[ticket.status]} textColor={STATUS_TEXT[ticket.status]} />
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{ticket.submitter_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{ticket.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}