import '../../css/dashboard.css';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminDashboard() {
  const [userStatsOpen, setUserStatsOpen] = useState(true);
  const [tweetStatsOpen, setTweetStatsOpen] = useState(true);

  return (
    <div className="dashboard-container animate__animated animate__fadeIn">
      <div className="dashboard-card animate__animated animate__fadeInUp">
        <h2 className="dashboard-title animate__animated animate__fadeInDown">
          <i className="bi bi-shield-lock"></i>
          Admin Dashboard
        </h2>
        <p className="dashboard-subtitle animate__animated animate__fadeIn">Manage users, tweets, and system settings</p>

        {/* Overview Stats */}
        <div className="stats-grid overview-grid animate__animated animate__fadeInUp">
          <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.1s' }}>
            <i className="bi bi-people stat-icon"></i>
            <div className="stat-value">42</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.2s' }}>
            <i className="bi bi-chat-square-text stat-icon"></i>
            <div className="stat-value">123</div>
            <div className="stat-label">Total Tweets</div>
          </div>
          <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.3s' }}>
            <i className="bi bi-activity stat-icon"></i>
            <div className="stat-value">98.5%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>

        {/* User Stats Section */}
        <div className="dashboard-section animate__animated animate__fadeInUp">
          <button className="section-header" onClick={() => setUserStatsOpen(!userStatsOpen)}>
            <span><i className="bi bi-people"></i> User Statistics</span>
            <span className={`section-toggle ${userStatsOpen ? 'open' : ''}`}>▼</span>
          </button>
          {userStatsOpen && (
            <div className="section-content">
              <div className="stats-grid">
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.1s' }}>
                  <i className="bi bi-person-check stat-icon"></i>
                  <div className="stat-value">7</div>
                  <div className="stat-label">Active Today</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.2s' }}>
                  <i className="bi bi-slash-circle stat-icon"></i>
                  <div className="stat-value">1</div>
                  <div className="stat-label">Banned</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.3s' }}>
                  <i className="bi bi-person-badge stat-icon"></i>
                  <div className="stat-value">34</div>
                  <div className="stat-label">Guest Users</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tweet Stats Section */}
        <div className="dashboard-section animate__animated animate__fadeInUp">
          <button className="section-header" onClick={() => setTweetStatsOpen(!tweetStatsOpen)}>
            <span><i className="bi bi-chat-square-text"></i> Tweet Statistics</span>
            <span className={`section-toggle ${tweetStatsOpen ? 'open' : ''}`}>▼</span>
          </button>
          {tweetStatsOpen && (
            <div className="section-content">
              <div className="stats-grid">
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.1s' }}>
                  <i className="bi bi-chat-square-text stat-icon"></i>
                  <div className="stat-value">123</div>
                  <div className="stat-label">Total Tweets</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.2s' }}>
                  <i className="bi bi-flag stat-icon"></i>
                  <div className="stat-value">2</div>
                  <div className="stat-label">Flagged</div>
                </div>
                <div className="stat-box animate__animated animate__zoomIn" style={{ animationDelay: '0.3s' }}>
                  <i className="bi bi-trash stat-icon"></i>
                  <div className="stat-value">5</div>
                  <div className="stat-label">Deleted</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-message animate__animated animate__fadeIn">
          <i className="bi bi-megaphone"></i>
          Admin notice: "Keep your users happy!"
        </div>
      </div>
    </div>
  );
}
