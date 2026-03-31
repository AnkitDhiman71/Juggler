import '../../css/navbar.css';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminNavbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-custom">
      <div className="navbar-responsive">
        <a href="/admin" className="navbar-brand">
          <i className="bi bi-shield-lock navbar-logo"></i>
          <span>Trendora Admin</span>
        </a>
        
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li><a href="/admin"><i className="bi bi-speedometer"></i> Dashboard</a></li>
            <li><a href="/admin/users"><i className="bi bi-people"></i> Users</a></li>
            <li><a href="/admin/tweets"><i className="bi bi-chat-square-text"></i> All Tweets</a></li>
            <li><button onClick={onLogout}><i className="bi bi-box-arrow-right"></i> Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
