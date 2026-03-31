import { NavLink } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import GuestNavbar from '../pages/guest/GuestNavbar';
import AdminNavbar from '../pages/admin/AdminNavbar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Layout = ({ children, user, onLogout }) => {
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  // Use AdminNavbar for admin routes
  if (isAdmin) {
    return (
      <div className="app-layout">
        <AdminNavbar onLogout={onLogout} />
        <main>{children}</main>
      </div>
    );
  }

  // Use GuestNavbar for authenticated guest users
  if (isAuthenticated) {
    return (
      <div className="app-layout">
        <GuestNavbar onLogout={onLogout} />
        <main>{children}</main>
      </div>
    );
  }

  // Use PublicNavbar for non-authenticated users
  return (
    <div className="app-layout">
      <PublicNavbar user={user} onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
