import '../css/signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, verifyOTP, resendOTP } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({ username, email, password });
      setOtpSent(true);
      setSuccess('OTP sent to your email!');
    } catch (err) {
      setError(err?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await verifyOTP({ email, otp });
      setVerified(true);
      setSuccess('Email verified successfully! Redirecting...');
      onSignup?.();
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resendOTP({ email });
      setSuccess('New OTP sent to your email!');
    } catch (err) {
      setError(err?.message || 'Failed to resend OTP.');
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

        {!otpSent ? (
          // Step 1: Registration Form
          <form onSubmit={handleSendOTP} className="signup-form animate__animated animate__fadeInUp">
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

            {success && (
              <div className="signup-success animate__animated animate__fadeIn">
                <i className="bi bi-check-circle"></i> {success}
              </div>
            )}

            <button type="submit" className="signup-submit animate__animated animate__pulse animate__infinite" disabled={loading}>
              <i className="bi bi-send"></i> {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : !verified ? (
          // Step 2: OTP Verification
          <form onSubmit={handleVerifyOTP} className="signup-form animate__animated animate__fadeInUp">
            <div className="form-group animate__animated animate__fadeInLeft">
              <label><i className="bi bi-key"></i> Enter OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                maxLength={6}
              />
            </div>

            {error && (
              <div className="signup-error animate__animated animate__shakeX">
                <i className="bi bi-exclamation-triangle"></i> {error}
              </div>
            )}

            {success && (
              <div className="signup-success animate__animated animate__fadeIn">
                <i className="bi bi-check-circle"></i> {success}
              </div>
            )}

            <button type="submit" className="signup-submit animate__animated animate__pulse animate__infinite" disabled={loading}>
              <i className="bi bi-check-circle"></i> {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              className="signup-resend animate__animated animate__fadeIn"
              onClick={handleResendOTP}
              disabled={loading}
              style={{
                marginTop: '10px',
                background: 'transparent',
                border: '2px solid #0d6efd',
                color: '#0d6efd',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              <i className="bi bi-arrow-clockwise"></i> Resend OTP
            </button>
          </form>
        ) : (
          // Step 3: Success
          <div className="signup-success animate__animated animate__fadeIn">
            <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#198754' }}></i>
            <p>{success}</p>
          </div>
        )}

        <div className="signup-footer animate__animated animate__fadeIn">
          <p>Already have an account? <button type="button" onClick={() => navigate('/login')}><i className="bi bi-box-arrow-in-right"></i> Login</button></p>
        </div>
      </div>
    </div>
  );
}
