import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import MusicClipSelector from '../components/mixer/MusicClipSelector';
import TrackMixer from '../components/mixer/TrackMixer';
import './MusicMixer.css';

const MusicMixer = () => {
  const [selectedClip, setSelectedClip] = useState(null);
  const [mixerData, setMixerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMixing, setIsMixing] = useState(false);

  const handleClipSelect = async (clip) => {
    setSelectedClip(clip);
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/mixer/${encodeURIComponent(clip.name)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMixerData(data);
    } catch (err) {
      console.error('Error fetching mixer data:', err);
      setError('Failed to load mixer data for this clip.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMixDownload = async (trackVolumes) => {
    setIsMixing(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/mix-and-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedClip.name,
          trackVolumes: trackVolumes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedClip.name.replace(/\.[^/.]+$/, '')}_mixed.wav`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      console.error('Error mixing and downloading:', err);
      setError('Failed to create mixed version. Please try again.');
    } finally {
      setIsMixing(false);
    }
  };

  return (
    <div className="music-mixer-page">
      <Navbar />
      <div className="mixer-container">
        <div className="mixer-header">
          <h1>Music Mixer</h1>
          <p>Select your music clips and mix the separated tracks to create your perfect sound</p>
        </div>

        <div className="mixer-content">
          <div className="mixer-left-panel">
            <MusicClipSelector 
              onClipSelect={handleClipSelect}
              selectedClip={selectedClip}
            />
          </div>

          <div className="mixer-right-panel">
            {selectedClip && (
              <div className="mixer-workspace">
                <div className="selected-clip-info">
                  <h3>Selected Clip: {selectedClip.name}</h3>
                  {mixerData && (
                    <div className="separation-status">
                      <span className={`status-indicator ${mixerData.separation_status.status}`}>
                        {mixerData.separation_status.status === 'complete' ? '✅' : 
                         mixerData.separation_status.status === 'processing' ? '⏳' : '❌'}
                      </span>
                      <span className="status-text">{mixerData.message}</span>
                    </div>
                  )}
                </div>

                {isLoading && (
                  <div className="loading-mixer">
                    <div className="spinner"></div>
                    <p>Loading mixer data...</p>
                  </div>
                )}

                {error && (
                  <div className="mixer-error">
                    <p>{error}</p>
                  </div>
                )}

                {mixerData && mixerData.separation_status.status === 'complete' && (
                  <TrackMixer 
                    filename={selectedClip.name}
                    channels={mixerData.separation_status.channels}
                    onMixDownload={handleMixDownload}
                    isMixing={isMixing}
                  />
                )}

                {mixerData && mixerData.separation_status.status === 'processing' && (
                  <div className="processing-message">
                    <p>🎵 Demucs is still separating your audio...</p>
                    <p>This may take a few minutes. You can refresh to check the status.</p>
                    <button 
                      className="refresh-button"
                      onClick={() => handleClipSelect(selectedClip)}
                    >
                      ↻ Refresh Status
                    </button>
                  </div>
                )}

                {mixerData && mixerData.separation_status.status === 'not_started' && (
                  <div className="not-started-message">
                    <p>🎵 This clip hasn't been separated yet.</p>
                    <p>Separation will start automatically when the clip is ready.</p>
                  </div>
                )}
              </div>
            )}

            {!selectedClip && (
              <div className="no-clip-selected">
                <div className="placeholder-content">
                  <h3>🎛️ Select a Music Clip</h3>
                  <p>Choose a clip from the left panel to start mixing</p>
                  <div className="mixer-features">
                    <div className="feature">
                      <span className="feature-icon">🎚️</span>
                      <span>Individual track volume control</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🎵</span>
                      <span>Real-time preview</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">⬇️</span>
                      <span>Download mixed version</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicMixer; 