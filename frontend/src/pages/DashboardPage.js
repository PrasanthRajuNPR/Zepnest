import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import RequestCard from '../components/RequestCard';
import CreateRequestModal from '../components/CreateRequestModal';
import './DashboardPage.css';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/requests/my')
      .then(res => setRequests(res.data.requests))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    progress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    cancelled: requests.filter(r => r.status === 'Cancelled').length,
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dash-container">

          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Requests</h1>
              <p className="dashboard-sub">Track your service requests</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New</button>
          </div>

          <div className="stats-row">
            {[
              { label: 'Total',       val: stats.total,     cls: '' },
              { label: 'Pending',     val: stats.pending,   cls: 'orange' },
              { label: 'In Progress', val: stats.progress,  cls: 'blue' },
              { label: 'Completed',   val: stats.completed, cls: 'green' },
              { label: 'Cancelled',   val: stats.cancelled, cls: 'red' },
            ].map(s => (
              <div className="stat-card card" key={s.label}>
                <div className={`stat-val ${s.cls}`}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="filter-row">
            {STATUS_FILTERS.map(s => (
              <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>

          {loading ? (
            <div className="center-pad"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📋</div>
              <h3>{filter === 'All' ? 'No requests yet' : `No ${filter} requests`}</h3>
              {filter === 'All' && (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Request</button>
              )}
            </div>
          ) : (
            <div className="requests-grid">
              {filtered.map(req => (
                <RequestCard key={req.id} request={req}
                  onDeleted={id => setRequests(p => p.filter(r => r.id !== id))} />
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <CreateRequestModal
          onClose={() => setShowModal(false)}
          onCreated={req => setRequests(p => [req, ...p])}
        />
      )}
    </>
  );
}
