import '../../css/navbar.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function GuestNavbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-custom">
      <div className="navbar-responsive">
        <a href="/guest" className="navbar-brand">
          <i className="bi bi-fire navbar-logo"></i>
          <span>Juggler</span>
        </a>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li><NavLink to="/home"><i className="bi bi-house"></i> Home</NavLink></li>
            <li><NavLink to="/guest"><i className="bi bi-speedometer"></i> Dashboard</NavLink></li>
            <li><NavLink to="/tweets"><i className="bi bi-chat-dots"></i> Tweets</NavLink></li>
            <li><NavLink to="/post-tweet"><i className="bi bi-pencil-square"></i> Post Tweet</NavLink></li>
            <li><NavLink to="/explore"><i className="bi bi-compass"></i> Explore</NavLink></li>
            <li><NavLink to="/profile"><i className="bi bi-person-circle"></i> Profile</NavLink></li>
            <li><button onClick={onLogout}><i className="bi bi-box-arrow-right"></i> Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
