import '../css/home.css';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const token = localStorage.getItem('jugglerToken');

  return (
    <div className="home-container animate__animated animate__fadeIn">
      <div className="home-card animate__animated animate__fadeInUp">
        <h1 className="home-title">
          <i className="bi bi-fire home-icon"></i>
          Welcome to Juggler
        </h1>
        <p className="home-subtitle animate__animated animate__fadeIn">A simple social tweet board with authentication</p>

        <div className="home-features">
          <div className="feature-item animate__animated animate__fadeInLeft" style={{ animationDelay: '0.2s' }}>
            <i className="bi bi-people feature-icon"></i>
            <span>Connect with friends</span>
          </div>
          <div className="feature-item animate__animated animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
            <i className="bi bi-chat-dots feature-icon"></i>
            <span>Share your thoughts</span>
          </div>
          <div className="feature-item animate__animated animate__fadeInRight" style={{ animationDelay: '0.6s' }}>
            <i className="bi bi-shield-check feature-icon"></i>
            <span>Secure & private</span>
          </div>
        </div>

        <div className="home-buttons animate__animated animate__fadeInUp">
          {!token ? (
            <>
              <Link to="/login" className="home-btn home-btn-primary">
                <i className="bi bi-box-arrow-in-right"></i> Login
              </Link>
              <Link to="/signup" className="home-btn home-btn-secondary">
                <i className="bi bi-person-plus"></i> Create Account
              </Link>
            </>
          ) : (
            <Link to="/tweets" className="home-btn home-btn-primary">
              <i className="bi bi-chat-square-text"></i> View Tweets
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
