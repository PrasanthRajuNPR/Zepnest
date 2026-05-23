import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-hex">⬡</span>
          <span className="brand-name">Zepnest</span>
          {user?.role === 'admin' && <span className="role-badge">Admin</span>}
        </div>
        {/* Desktop */}
        <div className="navbar-right desktop-only">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        </div>
        {/* Mobile hamburger */}
        <button className="hamburger mobile-only" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
