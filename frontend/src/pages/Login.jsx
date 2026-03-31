import '../css/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      console.log('Login successful, user:', result.user);
      await onLogin?.();
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate__animated animate__fadeIn">
      <div className="login-card animate__animated animate__fadeInUp">
        <h2 className="login-title animate__animated animate__fadeInDown">
          <i className="bi bi-box-arrow-in-right login-icon"></i>
          Login
        </h2>
        <p className="login-subtitle animate__animated animate__fadeIn">Sign in to continue to Trendora</p>

        <form onSubmit={submit} className="login-form animate__animated animate__fadeInUp">
          <div className="form-group animate__animated animate__fadeInLeft">
            <label><i className="bi bi-envelope"></i> Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group animate__animated animate__fadeInRight">
            <label><i className="bi bi-lock"></i> Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error animate__animated animate__shakeX">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
          )}

          <button type="submit" className="login-submit animate__animated animate__pulse animate__infinite" disabled={loading}>
            <i className="bi bi-key"></i> {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer animate__animated animate__fadeIn">
          <p>New here? <button type="button" onClick={() => navigate('/signup')}><i className="bi bi-person-plus"></i> Create Account</button></p>
        </div>
      </div>
    </div>
  );
}
