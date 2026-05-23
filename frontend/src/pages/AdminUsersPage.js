import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './AdminUsersPage.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = dt => new Date(dt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-hdr">
            <h1 className="admin-title">All Users</h1>
            <span className="user-count">{users.length} users</span>
          </div>

          {loading ? (
            <div className="center-pad"><div className="spinner" style={{margin:'0 auto'}}/></div>
          ) : users.length === 0 ? (
            <div className="empty-state card"><p>No users yet.</p></div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="table-wrap card desktop-table">
                <table className="u-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Email</th><th>Joined</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className="u-row" onClick={() => navigate(`/admin/users/${u.id}`)}>
                        <td className="td-num">{i+1}</td>
                        <td>
                          <div className="u-cell">
                            <div className="u-avatar">{u.name[0].toUpperCase()}</div>
                            <span className="u-name">{u.name}</span>
                          </div>
                        </td>
                        <td className="td-email">{u.email}</td>
                        <td className="td-date">{fmt(u.created_at)}</td>
                        <td>
                          <button className="btn btn-sm btn-primary"
                            onClick={e => { e.stopPropagation(); navigate(`/admin/users/${u.id}`); }}>
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mobile-users">
                {users.map(u => (
                  <div key={u.id} className="u-card card" onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <div className="u-avatar lg">{u.name[0].toUpperCase()}</div>
                    <div className="u-info">
                      <div className="u-name">{u.name}</div>
                      <div className="u-email">{u.email}</div>
                      <div className="u-date">Joined {fmt(u.created_at)}</div>
                    </div>
                    <span className="u-arrow">→</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
