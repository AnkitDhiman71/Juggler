import '../css/navbar.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PublicNavbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-custom">
      <div className="navbar-responsive">
        <a href="/home" className="navbar-brand">
          <i className="bi bi-fire navbar-logo"></i>
          <span>Trendora</span>
        </a>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li><NavLink to="/home"><i className="bi bi-house"></i> Home</NavLink></li>
            <li><NavLink to="/tweets"><i className="bi bi-chat-dots"></i> Tweets</NavLink></li>
            {!user ? (
              <>
                <li><NavLink to="/login"><i className="bi bi-box-arrow-in-right"></i> Login</NavLink></li>
                <li><NavLink to="/signup"><i className="bi bi-person-plus"></i> Signup</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/guest"><i className="bi bi-speedometer"></i> Dashboard</NavLink></li>
                <li><button onClick={onLogout}><i className="bi bi-box-arrow-right"></i> Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
