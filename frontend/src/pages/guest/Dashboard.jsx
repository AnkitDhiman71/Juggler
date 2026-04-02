import '../../css/dashboard.css';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function GuestDashboard() {
  const [statsOpen, setStatsOpen] = useState(true);
  const [exploreOpen, setExploreOpen] = useState(true);

  return (
    <div className="dashboard-container animate__animated animate__fadeIn">
      <div className="dashboard-card animate__animated animate__fadeInUp">
        <h2 className="dashboard-title animate__animated animate__fadeInDown">
          <i className="bi bi-speedometer2"></i>
          Guest Dashboard
        </h2>
        <p className="dashboard-subtitle animate__animated animate__fadeIn">Welcome! You can view and post tweets.</p>

        {/* Stats Section */}
        <div className="dashboard-section animate__animated animate__fadeInUp">
          <button className="section-header" onClick={() => setStatsOpen(!statsOpen)}>
            <span><i className="bi bi-bar-chart"></i> Your Stats</span>
            <span className={`section-toggle ${statsOpen ? 'open' : ''}`}>▼</span>
          </button>
          {statsOpen && (
            <div className="section-content">
              <div className="stats-grid">
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.1s' }}>
                  <i className="bi bi-chat-square-text stat-icon"></i>
                  <div className="stat-value">3</div>
                  <div className="stat-label">Tweets Posted</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.2s' }}>
                  <i className="bi bi-heart stat-icon"></i>
                  <div className="stat-value">12</div>
                  <div className="stat-label">Likes</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.3s' }}>
                  <i className="bi bi-people stat-icon"></i>
                  <div className="stat-value">0</div>
                  <div className="stat-label">Followers</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Explore Section */}
        <div className="dashboard-section animate__animated animate__fadeInUp">
          <button className="section-header" onClick={() => setExploreOpen(!exploreOpen)}>
            <span><i className="bi bi-compass"></i> Explore</span>
            <span className={`section-toggle ${exploreOpen ? 'open' : ''}`}>▼</span>
          </button>
          {exploreOpen && (
            <div className="section-content">
              <div className="explore-grid">
                <div className="explore-item animate__animated animate__fadeInLeft" style={{ animationDelay: '0.1s' }}>
                  <i className="bi bi-hash"></i> Juggler - 1.2K tweets
                </div>
                <div className="explore-item animate__animated animate__fadeInLeft" style={{ animationDelay: '0.2s' }}>
                  <i className="bi bi-hash"></i> HelloWorld - 856 tweets
                </div>
                <div className="explore-item animate__animated animate__fadeInRight" style={{ animationDelay: '0.3s' }}>
                  <i className="bi bi-hash"></i> Random - 2.4K tweets
                </div>
                <div className="explore-item animate__animated animate__fadeInRight" style={{ animationDelay: '0.4s' }}>
                  <i className="bi bi-hash"></i> Tech - 3.1K tweets
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-message animate__animated animate__fadeIn">
          <i className="bi bi-info-circle"></i>
          Random guest message: "Tweet something cool!"
        </div>
      </div>
    </div>
  );
}
