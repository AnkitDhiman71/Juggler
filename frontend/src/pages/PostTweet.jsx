import '../css/posttweet.css';
import { useState } from 'react';
import { createTweet } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PostTweet() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);
      
      await createTweet(formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setImage(null);
      setPreview(null);
      setError('');
      navigate('/tweets');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not post tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="posttweet-container animate__animated animate__fadeIn">
      <div className="posttweet-card animate__animated animate__fadeInUp">
        <h2 className="posttweet-title animate__animated animate__fadeInDown">
          <i className="bi bi-pencil-square"></i>
          Post a Tweet
        </h2>
        <form onSubmit={submit} className="animate__animated animate__fadeIn">
          <textarea
            rows={6}
            className="posttweet-input animate__animated animate__fadeInLeft"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            disabled={loading}
          />
          
          <div className="image-upload animate__animated animate__fadeInRight">
            <label className="image-upload-label">
              <i className="bi bi-image"></i> Add Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                hidden
              />
            </label>
            {preview && (
              <div className="image-preview animate__animated animate__zoomIn">
                <img src={preview} alt="Preview" />
                <button type="button" onClick={() => { setImage(null); setPreview(null); }}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>

          <div className="posttweet-actions animate__animated animate__fadeInUp">
            <button type="button" className="posttweet-cancel" onClick={() => navigate('/tweets')} disabled={loading}>
              <i className="bi bi-x-lg"></i> Cancel
            </button>
            <button type="submit" className="posttweet-submit animate__animated animate__pulse animate__infinite" disabled={loading}>
              <i className="bi bi-send"></i> {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && (
            <div className="posttweet-error animate__animated animate__shakeX">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
