import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './AdminUserRequestsPage.css';

const STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const STATUS_CLASS = {
  'Pending': 'badge-pending', 'In Progress': 'badge-progress',
  'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled',
};

const fmt = dt => new Date(dt).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function AdminUserRequestsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ user: null, requests: [] });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [lightbox, setLightbox] = useState(null); // stores image url

  useEffect(() => {
    setLoading(true);
    const url = `/api/admin/users/${userId}/requests${filter ? `?status=${filter}` : ''}`;
    api.get(url)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, filter]);

  const handleStatus = async (reqId, status) => {
    setUpdating(reqId);
    try {
      await api.patch(`/api/admin/requests/${reqId}/status`, { status });
      setData(prev => ({
        ...prev,
        requests: prev.requests.map(r => r.id === reqId ? { ...r, status } : r),
      }));
    } catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <>
      <Navbar />
      <div className="ar-page">
        <div className="ar-container">
          <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate('/admin/users')}>
            ← Back to Users
          </button>

          {data.user && (
            <div className="user-banner card">
              <div className="banner-av">{data.user.name[0].toUpperCase()}</div>
              <div className="banner-info">
                <div className="banner-name">{data.user.name}</div>
                <div className="banner-email">{data.user.email}</div>
              </div>
              <div className="banner-count">
                <span className="count-n">{data.requests.length}</span>
                <span className="count-l">Requests</span>
              </div>
            </div>
          )}

          <div className="ar-filter">
            <select className="form-input" value={filter} onChange={e => setFilter(e.target.value)}
              style={{minWidth:160}}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="center-pad"><div className="spinner" style={{margin:'0 auto'}}/></div>
          ) : data.requests.length === 0 ? (
            <div className="empty-state card"><p>No requests found.</p></div>
          ) : (
            <div className="ar-list">
              {data.requests.map(req => (
                <div key={req.id} className="ar-card card">
                  <div className="ar-img-wrap">
                    {req.image_url
                      ? <>
                          <img src={req.image_url} alt={req.title} />
                          <button className="ar-view-btn" onClick={() => setLightbox(req.image_url)} title="View full image">⛶</button>
                        </>
                      : <div className="ar-img-placeholder">🏠</div>
                    }
                  </div>
                  <div className="ar-body">
                    <div>
                      <div className="ar-top">
                        <div>
                          <h3 className="ar-title">{req.title}</h3>
                          <span className="ar-cat">{req.category}</span>
                        </div>
                        <span className={`badge ${STATUS_CLASS[req.status]}`}>{req.status}</span>
                      </div>
                      <p className="ar-desc">{req.description}</p>
                    </div>
                    <div className="ar-meta">
                      <span>📍 {req.address}</span>
                      <span>🕐 {fmt(req.preferred_time)}</span>
                    </div>
                  </div>
                  <div className="ar-action">
                    <label className="action-lbl">Update Status</label>
                    <select className="form-input" value={req.status}
                      disabled={updating === req.id}
                      onChange={e => handleStatus(req.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    {updating === req.id && <span className="saving-txt">Saving…</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {lightbox && (
        <div className="ar-lightbox" onClick={() => setLightbox(null)}>
          <button className="ar-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Full view" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
