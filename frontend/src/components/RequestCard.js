import { useState } from 'react';
import api from '../api/axios';
import './RequestCard.css';

const STATUS_CLASS = {
  'Pending': 'badge-pending', 'In Progress': 'badge-progress',
  'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled',
};

const fmt = (dt) => new Date(dt).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function RequestCard({ request, onDeleted }) {
  const [lightbox, setLightbox] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await api.delete(`/api/requests/${request.id}`);
      onDeleted(request.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <>
      <div className="req-card card">
        {request.image_url && (
          <div className="req-img-wrap">
            <img className="req-img" src={request.image_url} alt={request.title} />
            <button className="view-btn" onClick={() => setLightbox(true)} title="View full image">
              ⛶
            </button>
          </div>
        )}
        <div className="req-body">
          <div className="req-head">
            <div>
              <h3 className="req-title">{request.title}</h3>
              <span className="req-cat">{request.category}</span>
            </div>
            <span className={`badge ${STATUS_CLASS[request.status]}`}>{request.status}</span>
          </div>
          <p className="req-desc">{request.description}</p>
          <div className="req-meta">
            <span>📍 {request.address}</span>
            <span>🕐 {fmt(request.preferred_time)}</span>
          </div>
          <button className="btn btn-danger btn-sm del-btn" onClick={handleDelete}>🗑 Delete</button>
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <img src={request.image_url} alt={request.title} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
