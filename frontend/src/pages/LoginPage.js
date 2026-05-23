import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login, loginAdmin } = useAuth();
  const [tab, setTab] = useState('user'); // 'user' | 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'admin') await loginAdmin(form.email, form.password);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
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
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'user' ? 'active' : ''}`} onClick={() => { setTab('user'); setError(''); }}>
              User
            </button>
            <button className={`auth-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => { setTab('admin'); setError(''); }}>
              Admin
            </button>
          </div>

          <h2 className="auth-title">{tab === 'admin' ? 'Admin Login' : 'Welcome back'}</h2>
          <p className="auth-sub">{tab === 'admin' ? 'Access the admin dashboard' : 'Sign in to manage your requests'}</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder={tab === 'admin' ?"ex : admin@zepnest.com" : "ex : you@example.com"} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder={tab === 'admin' ?"Admin@123" : "••••••••"} />
            </div>
            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : tab === 'admin' ? 'Sign in as Admin' : 'Sign In →'}
            </button>
          </form>

          {tab === 'user' && (
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
