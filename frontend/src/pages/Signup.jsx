import '../css/signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
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
      await register({ username, email, password });
      onSignup?.();
      navigate('/login');
    } catch (err) {
      setError(err?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container animate__animated animate__fadeIn">
      <div className="signup-card animate__animated animate__fadeInUp">
        <h2 className="signup-title animate__animated animate__fadeInDown">
          <i className="bi bi-person-plus signup-icon"></i>
          Signup
        </h2>
        <p className="signup-subtitle animate__animated animate__fadeIn">Create your Juggler account</p>

        <form onSubmit={submit} className="signup-form animate__animated animate__fadeInUp">
          <div className="form-group animate__animated animate__fadeInLeft">
            <label><i className="bi bi-person"></i> Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="form-group animate__animated animate__fadeInRight">
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

          <div className="form-group animate__animated animate__fadeInLeft">
            <label><i className="bi bi-lock"></i> Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="signup-error animate__animated animate__shakeX">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
          )}

          <button type="submit" className="signup-submit animate__animated animate__pulse animate__infinite" disabled={loading}>
            <i className="bi bi-check-circle"></i> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer animate__animated animate__fadeIn">
          <p>Already have an account? <button type="button" onClick={() => navigate('/login')}><i className="bi bi-box-arrow-in-right"></i> Login</button></p>
        </div>
      </div>
    </div>
  );
}
