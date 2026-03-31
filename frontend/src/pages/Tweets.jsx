import '../css/tweets.css';
import { useEffect, useState } from 'react';
import { fetchTweets, getSessionUser } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTweets = async () => {
    setLoading(true);
    try {
      const res = await fetchTweets();
      setTweets(res.data);
      setError('');
    } catch (err) {
      setError(err?.message || 'Could not load tweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
    getSessionUser().then(res => setUser(res.user)).catch(() => setUser(null));
  }, []);

  return (
    <div className="tweets-container">
      <div className="responsive-container">
        <div className="tweets-feed-card">
          <h2 className="feed-title">
            <i className="bi bi-chat-dots"></i>
            Tweets
          </h2>

          {loading && <div className="tweets-loading"><i className="bi bi-hourglass-split"></i> Loading...</div>}

          {error && !loading && <div className="tweets-error"><i className="bi bi-exclamation-triangle"></i> {error}</div>}

          {!loading && !error && tweets.length === 0 && (
            <div className="tweets-empty">
              <i className="bi bi-inbox"></i>
              <p>No tweets yet. Be the first to share something!</p>
            </div>
          )}

          {!loading && !error && tweets.length > 0 && (
            <ul className="tweet-list">
              {tweets.map((tweet, index) => (
                <li 
                  key={tweet._id} 
                  className="tweet-item animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="tweet-user">
                    <i className="bi bi-person-circle"></i>
                    {tweet.user?.username || 'User'}
                  </div>
                  <div className="tweet-content">{tweet.content}</div>
                  {tweet.image && (
                    <img src={`${BACKEND_URL}${tweet.image}`} alt="Tweet image" className="tweet-image animate__animated animate__zoomIn" />
                  )}
                  <div className="tweet-time">
                    <i className="bi bi-clock"></i>
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
