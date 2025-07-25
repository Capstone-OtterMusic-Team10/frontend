import { useState, useEffect } from 'react';
import './MusicClipSelector.css';
import { api } from '../../utils';
const MusicClipSelector = ({ onClipSelect, selectedClip }) => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMusicFiles();
  }, []);

  const fetchMusicFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('api/music-files');
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setMusicFiles(response.data.files);
    } catch (err) {
      console.error('Error fetching music files:', err);
      setError('Failed to load music files. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClipSelect = (clip) => {
    onClipSelect(clip);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getClipInfo = (filename) => {
    // Extract chat and message IDs from Lyria filename format: lyria_{chat_id}_{message_id}.wav
    const match = filename.match(/lyria_(\d+)_(\d+)\.wav/);
    if (match) {
      const [, chatId, messageId] = match;
      return {
        chatId,
        messageId,
        isLyriaClip: true
      };
    }
    return {
      isLyriaClip: false
    };
  };

  if (loading) {
    return (
      <div className="clip-selector">
        <h2>Music Clips</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your music clips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clip-selector">
        <h2>Music Clips</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMusicFiles} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="clip-selector">
      <div className="selector-header">
        <h2>Music Clips</h2>
        <button onClick={fetchMusicFiles} className="refresh-button">
          ↻ Refresh
        </button>
      </div>

      {musicFiles.length === 0 ? (
        <div className="no-files">
          <p>No music clips found.</p>
          <p>Create some music in the chat to get started!</p>
        </div>
      ) : (
        <div className="clips-list">
          {musicFiles.map((file, index) => {
            const clipInfo = getClipInfo(file.name);
            return (
              <div
                key={index}
                className={`clip-item ${selectedClip?.name === file.name ? 'selected' : ''}`}
                onClick={() => handleClipSelect(file)}
              >
                <div className="clip-info">
                  <div className="clip-name">
                    {clipInfo.isLyriaClip ? (
                      <span className="lyria-badge">🎵</span>
                    ) : (
                      <span className="file-badge">📁</span>
                    )}
                    {file.name}
                  </div>
                  {clipInfo.isLyriaClip && (
                    <div className="clip-details">
                      <span>Chat {clipInfo.chatId}</span>
                      <span>•</span>
                      <span>Message {clipInfo.messageId}</span>
                    </div>
                  )}
                  <div className="clip-meta">
                    {file.size && <span>{formatFileSize(file.size)}</span>}
                    {file.upload_date && (
                      <span>{new Date(file.upload_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="clip-actions">
                  <button 
                    className="preview-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Preview functionality could be added here
                    }}
                    title="Preview"
                  >
                    ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MusicClipSelector; 