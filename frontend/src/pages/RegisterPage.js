import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon-lg">⬡</span>
          <h1>Zepnest</h1>
          <p>Home Care, At a Tap.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card card">
          <h2 className="auth-title">Create account</h2>
          <p className="auth-sub">Get started with Zepnest today</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" required
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" required minLength={6}
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Min. 6 characters" />
            </div>
            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
