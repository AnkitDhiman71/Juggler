import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tweets from './pages/Tweets';
import PostTweet from './pages/PostTweet';
import AdminDashboard from './pages/admin/Dashboard';
import GuestDashboard from './pages/guest/Dashboard';
import { getSessionUser, logout } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSessionUser()
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.error('Session check failed:', err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  const isAuthenticated = !!user;
  const role = user?.role || 'guest';

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin' : '/guest'} replace /> : <Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={
          <Login onLogin={async () => {
            const res = await getSessionUser();
            setUser(res.user);
            if (res.user?.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/guest');
            }
          }} />
        } />
        <Route path="/signup" element={<Signup onSignup={() => {}} />} />
        <Route path="/tweets" element={isAuthenticated ? <Tweets /> : <Navigate to="/login" replace />} />
        <Route path="/post-tweet" element={isAuthenticated ? <PostTweet /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
        <Route path="/guest" element={isAuthenticated && role === 'guest' ? <GuestDashboard /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;

