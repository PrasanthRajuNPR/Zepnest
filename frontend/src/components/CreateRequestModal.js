import { useState } from 'react';
import api from '../api/axios';
import './CreateRequestModal.css';

const CATEGORIES = ['Plumbing','Electrical','Cleaning','Carpentry','Painting','Appliance Repair','Pest Control','Landscaping','Other'];

export default function CreateRequestModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title:'', description:'', category:'', address:'', preferred_time:'' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v]) => data.append(k,v));
      if (image) data.append('image', image);
      const res = await api.post('/api/requests', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated(res.data.request); onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box card">
        <div className="modal-hdr">
          <h2>New Service Request</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" name="title" value={form.title} required
                onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Fix leaking pipe" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" name="category" value={form.category} required
                onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" value={form.description} required rows={3}
              onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the issue..." />
          </div>
          <div className="form-group">
            <label className="form-label">Address *</label>
            <input className="form-input" value={form.address} required
              onChange={e => setForm({...form, address: e.target.value})} placeholder="Full service address" />
          </div>
          <div className="form-row2">
            <div className="form-group">
              <label className="form-label">Preferred Time *</label>
              <input className="form-input" type="datetime-local" value={form.preferred_time} required
                onChange={e => setForm({...form, preferred_time: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Image (optional)</label>
              <input className="form-input" type="file" accept="image/*"
                onChange={e => setImage(e.target.files[0])} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : '✓ Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
